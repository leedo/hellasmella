package HellaSmella;

use strict;
use warnings;

use Net::Newzbin;
use Catalyst::Runtime '5.70';

# Set flags and add plugins for the application
#
#         -Debug: activates the debug mode for very useful log messages
#   ConfigLoader: will load the configuration from a YAML file in the
#                 application's home directory
# Static::Simple: will serve static files from the application's root 
#                 directory

use Catalyst qw/
	-Debug
	StackTrace
	ConfigLoader
	Static::Simple
	Authentication
	Authentication::Store::Minimal
	Authentication::Credential::HTTP
/;

our $VERSION = '0.10';

# Configure the application. 
#
# Note that settings in HellaSmella.yml (or other external
# configuration file that you set up manually) take precedence
# over this when using ConfigLoader. Thus configuration
# details given here can function as a default configuration,
# with a external configuration file acting as an override for
# local deployment.

__PACKAGE__->config( 
	name => 'HellaSmella',
	default_view => 'TT',
);

__PACKAGE__->config->{authentication}{http}{type} = 'basic';

# Start the application
__PACKAGE__->setup;

=head1 NAME

HellaSmella - Catalyst based application

=head1 SYNOPSIS

    script/hellasmella_server.pl

=head1 DESCRIPTION

[enter your description here]

=head1 SEE ALSO

L<HellaSmella::Controller::Root>, L<Catalyst>

=head1 AUTHOR

Lee Aylward,,,

=head1 LICENSE

This library is free software, you can redistribute it and/or modify
it under the same terms as Perl itself.

=cut

1;
