#!/usr/bin/perl
#
# Sample perl script for thunderbird extension tbmailarchive
#
#

use strict;
use Tk;

my $text = "12";

my $fileName = $ARGV[0];

my @info = stat($fileName);

$text  = "file name  :" . $fileName;
$text .= "\nfile size  :" . $info[7];
$text .= "\nfile mtime :" . $info[9];

my $main = new MainWindow;
my $label = $main->Label('-textvariable' => \$text);
my $button = $main->Button(
    '-text' => 'Quit',
    '-command' => sub { exit }
);
$label->pack;
$button->pack;
MainLoop;
