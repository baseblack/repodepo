<?php
    Configure::write('debug', 0);
    if (isset($auth['User'])){ 
        $auth['authenticated'] = true;
    }else{
        $auth['authenticated'] = false;
    }
    echo json_encode($auth);
?>
