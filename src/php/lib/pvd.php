<?php
/**
 * This function is for debugging purpose and prints var_dump (pvd)
*/
function pvd($in, $data = false)
{
    if (WP_DEBUG) {
        $func_var = func_get_args();
        $getPos = true;

        if ($getPos) {
            $data = ($data ? $data : debug_backtrace(DEBUG_BACKTRACE_PROVIDE_OBJECT, 1));
            print "pvd::" . $data[0]["file"] . "->" . $data[0]["line"] . "<br>";
        }

        print "<pre title='" . $data[0]["file"] . "->" . $data[0]["line"] . "'>";
        var_dump($in);
        print "</pre>";
    }
}
