package HellaSmella::Controller::Root;

use strict;
use warnings;
use base 'Catalyst::Controller';

use POSIX qw/ceil floor/;

#
# Sets the actions in this controller to be registered with no prefix
# so they function identically to actions created in MyApp.pm
#
__PACKAGE__->config->{namespace} = '';

=head1 NAME

HellaSmella::Controller::Root - Root Controller for HellaSmella

=head1 DESCRIPTION

[enter your description here]

=head1 METHODS

=cut

=head2 index

=cut

sub auto : Private {
	my ( $self, $c ) = @_;
	if ( ! $c->authenticate_http ) {
		$c->authorization_required_response( realm => "HellaSmella" );
	}
	$c->stash->{categories} = $c->model('Newzbin')->categories;
	$c->stash->{root} = $c->req->base->as_string;
}

sub index : Private {
    my ( $self, $c ) = @_;
	$c->stash->{template} = 'list.tt';
	$c->forward('status');
}

sub pause : Local {
	my ( $self, $c ) = @_;
	eval {
		$c->model('Hellanzb')->send_request('pause');
	};
	if ($c->req->header('Accept') =~ /^text\/javascript/) {
		$c->forward('status');
	}
	else {
		$c->res->redirect($c->req->base);
	}
}

sub continue : Local {
	my ( $self, $c ) = @_;
	eval {
		$c->model('Hellanzb')->send_request('continue');
	};
	if ($c->req->header('Accept') =~ /^text\/javascript/) {
		$c->forward('status');
	}
	else {
		$c->res->redirect($c->req->base);
	}
}

sub add : Local {
	my ( $self, $c ) = @_;
	my $msgid = $c->req->param('msgid');
	
	if ($msgid =~ /\d{7,}/) {
		eval {
			my $resp = $c->model('Hellanzb')->send_request('enqueuenewzbin',$msgid);
		};
	}
	if ($c->req->header('Accept') =~ /^text\/javascript/) {
		$c->forward('status');
	}
	else {
		$c->res->redirect($c->req->base);
	}
}

sub clearall : Local {
	my ( $self, $c ) = @_;
	eval {
		$c->model('Hellanzb')->send_request('clear','True');
	};
	if ($c->req->header('Accept') =~ /^text\/javascript/) {
		$c->forward('status');
	}
	else {
		$c->res->redirect($c->req->base);
	}

}

#ajax search
sub search : Local {
	my ( $self, $c ) = @_;
	my $query = $c->req->param('q');
	my $cat = $c->req->param('category');
	$cat = -1 unless ($cat >= -1 and $cat <= 13);

	$c->stash->{results} = $c->model('Newzbin')->search(
		query => $query,
		catid => $cat
	);
}

# static search page
sub searchr : Local {
	my ( $self, $c ) = @_;
	$c->stash->{template} = 'list.tt';
	$c->forward('search');
	$c->forward('index');
}

sub remove : Local {
	my ( $self, $c ) = @_;
	my $id = $c->req->param('id');
	if ($id =~ /\d+/) {
		eval {
			$c->model('Hellanzb')->send_request('dequeue',$id);
		};
	}
	if ($c->req->header('Accept') =~ /^text\/javascript/) {
		$c->forward('status');
	}
	else {
		$c->res->redirect($c->req->base);
	}
}

sub cancel : Local {
	my ( $self, $c ) = @_;
	my $id = $c->req->param('id');
	if ($id =~/\d+/) {
		eval {
			$c->model('Hellanzb')->send_request('cancel');
		};
	}
	if ($c->req->header('Accept') =~ /^text\/javascript/) {
		$c->forward('status');
	}
	else {
		$c->res->redirect($c->req->base);
	}
}

sub status : Local {
	my ( $self, $c ) = @_;
	eval {
		$c->stash->{status} = $c->model('Hellanzb')->send_request('status')->value;
	};
	return if $@;
	if ($c->stash->{status}{rate} > 0) {
		my $time = ceil(
			(($c->stash->{status}{queued_mb} * 1000)
				/ $c->stash->{status}{rate}) / 61);
		my $hours = floor($time / 60);
		$c->stash->{status}{time_remaining} = { 
			hours	=> $hours,
			minutes => $time - ($hours * 60),
		};
	}
	$c->stash->{status}{completed} = [];
	for ( reverse @{ $c->stash->{status}{log_entries} } ) {
		if ( exists $_->{INFO} and $_->{INFO} =~ /^(.*)\: finished processing/i ) {
			push @{ $c->stash->{status}{completed} }, { nzbName => $1 };
		}
	}
	if ($c->req->header('Accept') =~ /^text\/javascript/) {
		$c->forward( 'HellaSmella::View::JSON' );
	}
}

sub resort : Local {
	my ( $self, $c ) = @_;
	my @queuelist = $c->req->param('queuelist[]');
	eval {
		$c->model('Hellanzb')->send_request('force',$queuelist[0]);
	};
	return if $@;
	for (1 .. scalar @queuelist) {
		$c->model('Hellanzb')->send_request('move',$queuelist[$_],$_);
	}
	$c->forward('status');
}

sub info : Local {
	my ( $self, $c ) = @_;
	my $msgid = $c->req->param('msgid');

	if ($msgid and $msgid =~ /\d{7,}/) {
		$c->stash->{info} = $c->model('Newzbin')->info($msgid);
	}

	$c->forward( 'HellaSmella::View::JSON' );
}

sub upload_form : Local {
	my ($self,$c) = @_;
}

sub upload : Local {
	my ($self, $c) = @_;
	my $nzbdir = $c->config->{nzb_directory};
	my $upload = $c->req->upload('nzbfile');
	if ($upload and $upload->filename =~ /\.nzb$/ and -e $nzbdir) {
		$upload->copy_to($nzbdir . $upload->filename);
		$c->stash->{template} = 'upload_success.tt';
	}
	else {
		$c->log->error("\"$nzbdir\" does not exist!");
		$c->stash->{template} = 'upload_failure.tt';
	}
}

=head2 end

Attempt to render a view, if needed.

=cut 

sub end : ActionClass('RenderView') {}

=head1 AUTHOR

Lee Aylward,,,

=head1 LICENSE

This library is free software, you can redistribute it and/or modify
it under the same terms as Perl itself.

=cut

1;
