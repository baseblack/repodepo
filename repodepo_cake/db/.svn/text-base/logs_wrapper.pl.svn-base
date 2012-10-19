#! /usr/bin/perl -w
##
use strict;
#
#------------------------------------------------------------------------------------------------
#---- This script makes use of environment variables to pass on to a cake php console -----------
#---- The cake php console then determines what action to do ------------------------------------
#------------------------------------------------------------------------------------------------

my $command;

if($ARGV[0] eq 'add'){
#Assume an add action
    my $action  = $ARGV[0];
    my $distro  = $ARGV[1];
    my $comp    = $ARGV[3];
    my $arch    = $ARGV[4];
    my $name    = $ARGV[5];
    my $version = $ARGV[6];
    my $file    = $ARGV[8];
    my $conf    = $ENV{'REPREPRO_CONF_DIR'};

    #EG /var/www/c2/cake/console/cake -app /var/www/c2/repodepo_cake activity -action add -distro hardy-updates -comp main -arch i386 -name adept-notifier -version 2.1.3ubuntu25.1 -file pool/main/a/adept/adept-notifier_2.1.3ubuntu25.1_i386.deb -conf /var/repodepo/confs/CSIR/i386

    $command = "/var/www/c2/cake/console/cake -app /var/www/c2/repodepo_cake activity -action $action -distro $distro -comp $comp -arch $arch -name $name -version $version -file $file -conf $conf"; 
    system($command);	
}


if($ARGV[0] eq 'replace'){
#Assume an add action
    my $action  = $ARGV[0];
    my $distro  = $ARGV[1];
    my $comp    = $ARGV[3];
    my $arch    = $ARGV[4];
    my $name    = $ARGV[5];
    my $version = $ARGV[6];
    my $file    = $ARGV[9];
    my $conf    = $ENV{'REPREPRO_CONF_DIR'};

    #EG /var/www/c2/cake/console/cake -app /var/www/c2/repodepo_cake activity -action add -distro hardy-updates -comp main -arch i386 -name adept-notifier -version 2.1.3ubuntu25.1 -file pool/main/a/adept/adept-notifier_2.1.3ubuntu25.1_i386.deb -conf /var/repodepo/confs/CSIR/i386

    $command = "/var/www/c2/cake/console/cake -app /var/www/c2/repodepo_cake activity -action $action -distro $distro -comp $comp -arch $arch -name $name -version $version -file $file -conf $conf"; 
    system($command);   
}




my $file = '/var/repodepo/logs/arguments.txt';
open(INFO, ">>$file")or  die("Error: cannot open file 'data.txt' $! \n");# Open for appending

print INFO ("==================================\n");
print INFO ("$command\n");
foreach my $item(keys(%ENV)){

	print INFO ("$item : $ENV{$item}\n");

}
print INFO ("==================================\n");

my $counter = 1;
foreach my $argument(@ARGV){

        print INFO ("ARGUMENT $counter : $argument\n");
	$counter++;
}
print INFO ("==================================\n\n");

close(INFO);
