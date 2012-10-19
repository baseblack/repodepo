<div class='divPackageDetail'>
<?php

    Configure::write('debug', 0);
    //  echo $javascript->object($json_return); 
    //print_r($detail_return);

    //Detail tab (if exists)
    foreach($detail_return as $item){

        if(preg_match('/.+:.+/',$item)){

            $value = preg_replace('/^.+:\s+/','',$item);
            $param = preg_replace('/:\s+.+/','',$item);
            //print("Param: $param VALUE: $value<br>\n");
            print ("<label >".$param."</label>\n");
            print ($value."<br>\n");
            print ("<br>\n");
        }
    }

    //File tab (if exists)
    foreach($file_return as $item){

        if(preg_match('"\./.+"',$item)){

            $file_name = preg_replace('".+\./"','',$item);
            print("<b>/$file_name</b><br>\n");

        }
    }

    //Activity tab (if exists)
    foreach($activity_return as $item){

        if($item['type'] == 'new'){
            print "<div class='ActionNew'>\n";
        }elseif($item['type'] == 'update'){

             print "<div class='ActionUpdate'>\n";
        }else{

             print "<div>\n";
        }
        
        print ("<label >Type</label>\n");
        print ($item['type']."<br clear='both'>\n");

        print ("<label >Date</label>\n");
        print ($item['time']."<br clear='both'>\n");

        print ("<label >File</label>\n");
        print ($item['file']."<br clear='both'>\n");

         print ("<label >Version</label>\n");
        print ($item['version']."<br clear='both'>\n");

        print "</div>\n";
        print "<br>\n";
    }

   // print_r($file_return);
?>
</div>