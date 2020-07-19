<?php
setcookie($_GET["name"], $_GET["value"], time() + (86400 * 30), "/"); // 86400 *30 = 30 days
if(!isset($_COOKIE[$_GET["name"]])) {
    echo "";
} else {
    echo $_COOKIE[$_GET["name"]];
}
?>