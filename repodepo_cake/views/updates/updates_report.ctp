<?php

    Configure::write('debug', 0);
    $i = 0;
        foreach($report_array as $upd){

            print "============================================================================\n";
            print "====== Update Report    ====================================================\n";
            print "====== Repository: ".$report_array[$i]['repo']."\n";
            print "====== Architecture: ".$report_array[$i]['arch']."\n";
            print "====== Total: ".$report_array[$i]['total']."\n";
            print "====== Date: ".$report_array[$i]['date']."\n";
            print "============================================================================\n\n";
            $n = 0;
            foreach($report_array[$i]['packages'] as $p){

                print   $report_array[$i]['packages'][$n]['comp'].','.
                        $report_array[$i]['packages'][$n]['package_name'].','.
                        $report_array[$i]['packages'][$n]['activity'].','.
                        $report_array[$i]['packages'][$n]['version'].','.
                        $report_array[$i]['packages'][$n]['file'].
                        "\n";
                $n++;
            }
            print "============================================================================\n\n\n\n";
            $i++;
        }

?>