<?php
if(!isset($_COOKIE[$_GET["name"]])) {
    echo "";
} else {
    echo $_COOKIE[$_GET["name"]];
}
?>