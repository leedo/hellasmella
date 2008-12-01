use inc::Module::Install;

name 'HellaSmella';
all_from 'lib/HellaSmella.pm';

requires 'Catalyst' => '5.7007';
requires 'Catalyst::Plugin::ConfigLoader';
requires 'Catalyst::Plugin::Static::Simple';
requires 'Catalyst::Action::RenderView';
requires 'Catalyst::Model::XMLRPC';
requires 'Catalyst::Plugin::Authentication::Credential::HTTP';
requires 'Catalyst::View::TT';
requires 'Catalyst::View::JSON';
requires 'File::Temp';
requires 'LWP::UserAgent';
requires 'HTTP::Cookies';
requires 'POSIX';
requires 'JSON::Any';
requires 'YAML'; # This should reflect the config file format you've chosen
                 # See Catalyst::Plugin::ConfigLoader for supported formats
catalyst;

install_script glob('script/*.pl');
auto_install;
WriteAll;
