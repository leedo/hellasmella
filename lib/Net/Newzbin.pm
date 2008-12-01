package Net::Newzbin;

use strict;
use warnings;

use HTTP::Cookies;
use LWP::UserAgent;
use POSIX qw/ceil/;
use File::Temp;

use constant { FALSE => 0, TRUE => 1 };
my $ua = LWP::UserAgent->new;

our $cats = {
	anime		=> {
		alias	=> [],
		id		=> 11,
	},
	apps		=> {
		alias	=> ['applications','program','app',],
		id		=> 1,
	},
	books		=> {
		alias	=> [],
		id		=> 13,
	},
	consoles	=> {
		alias	=> ['console','xbox','ps2','playstation'],
		id		=> 2,
	},
	emulation	=> {
		alias	=> ['emu'],
		id		=> 10,
	},
	games		=> {
		alias	=> ['game'],
		id		=> 4,
	},
	misc		=> {
		alias	=> [],
		id		=> 5,
	},
	movies		=> {
		alias	=> ['movie','film'],
		id		=> 6,
	},
	music		=> {
		alias	=> [],
		id		=> 7,
	},
	pda			=> {
		alias	=> ['palm'],
		id		=> 12,
	},
	tv 			=> {
		alias	=> ['television'],
		id		=> 8,
	},
	all			=> {
		alias	=> [],
		id		=> -1,
	}
};

sub new {
	my $class = shift;
	my $options = shift;

	if (! $options->{user} or ! $options->{pass}) {
		warn "need user, pass, and cookie file parameters\n";
		return FALSE;
	}

	my $cookie;
	if (exists $options->{cookie}) {
		$cookie = HTTP::Cookies->new(
			file		=> $options->{cookie},
			autosave	=> TRUE,
		);
	}
	else {
		$cookie = HTTP::Cookies->new;
	}
	$ua->cookie_jar($cookie);

	my $self = {
		user	=> $options->{user},
		pass	=> $options->{pass},
		search	=> {
			query	=> undef,
			catid	=> -1,
			days	=> 20,
		}
	};
	
	bless $self,$class;
}

sub login {
	my $self = shift;
	my $res = $ua->post('http://v2.newzbin.com/account/login',{
			username	=> $self->{user},
			password	=> $self->{pass},
	});
	if ($res->code == 302) {
		my $res = $ua->get($res->header('Location'));
		return TRUE;
	}
	else {
		warn "unable to log into Newzbin\n";
		return FALSE;
	}
}

sub logged {
	my $self = shift;
	my $res = $ua->get('http://v2.newzbin.com/');
	if ($res->is_success) {
		return $res->content =~ /title="Log Out"/g;
	}
	else {
		return FALSE;
	}
}

sub search {
	my ($self,$search) = @_;

	if (! $self->logged) {
		warn "relogging into newzbin\n";
		$self->login;
	}

	$self->{search} = $search;
	
	my $content = _search($self->{search});
	unless ($content) {
		warn "failed to get a valid response from newzbin\n";
		return $self;
	}

	return _parse_results($self->{search}{days},$content);
}

sub _search {
	my $search = shift;
	my $res = $ua->get('http://v2.newzbin.com/search/query/p/?q='.
						$search->{query}.'&Category='.$search->{catid}.
						'&searchFP=p');
	if ($res->is_success) {
		return $res->content;
	}
	return FALSE;
}

sub _parse_results {
	my ($days,$content) = @_;
	my @results;
	
	$_ = $content;
	while (/browse\/post\/(\d{7})\/">(.+?)<\/a>(?:\n|.+?\n)+?<td>(\d+(?:d|h))/g) {
		if ($1 and $2 and $3) {

			my $result = {
				nzbid => $1,
				title => $2,
				days  => $3,
			};

			if ($result->{days} =~ /(\d+)h/) {
				$result->{days} = ceil($1 / 24);
			}
			else {
				$result->{days} =~ s/d//;
			}

			push @results,$result if $result->{days} <= $days;
		}
		next;
	}
	return [ sort { $a->{days} <=> $b->{days} } @results ];
}

sub info {
	my ($self,$nzbid) = @_;

	if (! $self->logged) {
		warn "relogging into newzbin\n";
		$self->login;
	}

	my $content = _get_post($nzbid);
	unless ($content) {
		warn 'failed to get a file list for post';
		return FALSE;
	}

	my $info = _parse_info($content);
	return $info;
}

sub _get_post {
	my $nzbid = shift;
	my $res = $ua->get("http://v2.newzbin.com/browse/post/$nzbid");
	if ($res->is_success) {
		return $res->content;
	}
	return FALSE;
}

sub _parse_post {
	my $content = shift;

	my @files;
	while ($content =~ /name="(\d+)" checked="checked"/g) {
		push @files,$1;
	}
	return \@files;
}

sub _parse_info {
	my $content = shift;
	my $info = {};
	($info->{size}) = $content =~ /Total Size:<\/td>\n<td>(\d+?,?\d+\.?\d+? \w{2})/g;
	($info->{filename}) = $content =~ /.*alt="INFO".*?<td>.*?<td>(.*?)<\/td>/s;
	return $info;
}

sub categories {
	return $cats;
}
