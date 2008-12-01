package HellaSmella::Model::Newzbin;

use strict;
use warnings;

use base qw/Catalyst::Model/;

use Carp;
use NEXT;
use Net::Newzbin;

sub new {
	my ($class, $c, $config) = @_;
	my $self = $class->NEXT::new($c, $config);
	$self->config($config);
	$self->{client} = Net::Newzbin->new({
		user => $self->config->{username},
		pass => $self->config->{password},
	});
	return $self;
}

sub search {
	my ($self,%args) = @_;
	return [] unless $args{query};

	$args{catid} = -1 unless ($args{catid} >= -1 and $args{catid} <= 13);
	my $query = join("+",split(" ",$args{query}));
	return $self->{client}->search({
		catid	=> $args{catid},
		query	=> $query,
		days	=> 200,
	});
}

sub info {
	my ($self, $nzbid) = @_;
	if ($nzbid) {
		return $self->{client}->info($nzbid);
	}
}

sub categories {
	my $self = shift;
	return $self->{client}->categories;
}

1;
