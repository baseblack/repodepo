<?php

class RemoverComponent extends Object {

   function remove($pi){

        $rd_dir     = Configure::read('Reprepro.base');
        $add_path   = $pi['repo']['name'].'/'.$pi['arch']['name'];

        $conf_dir   = $rd_dir.Configure::read('Reprepro.confs').'/'.$add_path;
        $db_dir     = $rd_dir.Configure::read('Reprepro.dbs').'/'.$add_path;
        $dist_dir   = $rd_dir.Configure::read('Reprepro.dists').'/'.$add_path;

        $distro     = $pi['distro']['name'];
        $comp       = $pi['distrocomp']['name'];
        $package    = $pi['package']['name'];

        $command    = "/usr/bin/reprepro -V --ignore=undefinedtarget --noskipold --silent --confdir $conf_dir --dbdir $db_dir --outdir $dist_dir -C $comp remove $distro $package";
        CakeLog::write('notice', "REPODEPO: $command");
        exec($command);
    }
}

?>
