<?php
    include("database.php");

if ($_REQUEST["type"] == "Role"){
	$sql = "update Security_Roles ";
	$sql .= "set name = '" . $_REQUEST["name"] . "', active = '" . $_REQUEST["active"] . "' ";
	$sql .= "where id = " . $_REQUEST["id"];
}

if ($conn->query($sql) === TRUE) 
	echo "success";
else
	echo "failed";

$conn->close();
?>