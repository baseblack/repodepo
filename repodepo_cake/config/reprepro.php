<?php

$config['Reprepro']['base']     = '/var/repodepo/';
$config['Reprepro']['confs']    = 'confs';
$config['Reprepro']['dbs']      = 'dbs';
$config['Reprepro']['dists']    = 'dists';
$config['Reprepro']['logs']     = 'logs';
$config['Reprepro']['keyrings'] = 'keyrings';


//File where info is logged
$config['Reprepro']['info_log']     = $config['Reprepro']['base'].$config['Reprepro']['logs'].'/info.log';

$config['Reprepro']['form_edit_components'] = array('Origin','Label','Suite','Version','Description');
?>
