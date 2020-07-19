<?php
    include("database.php");

$sql = "delete from Security_EntityRoleRights where entityrole_id='" . $_REQUEST["entityrole_id"] . "'";
$conn->query($sql);
$rights = explode("|", $_REQUEST["rights"]);
for ($i = 0; $i < count($rights) - 1; $i++){
	$sql = "insert into Security_EntityRoleRights (entityrole_id, right_id, active) values ('";
	$sql .= $_REQUEST["entityrole_id"] . "','" . $rights[$i] . "','1')";
	if ($conn->query($sql) === FALSE){
		//echo $sql . "\n";
		echo "Error saving right\n";
	}
}
$conn->close();
?>