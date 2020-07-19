<?php
    include("database.php");

// get the user
$sql = "select ";
$sql .= "e.name EntityName, r.name RoleName, ri.name RightName ";
$sql .= "from Security_Users u ";
$sql .= "join Security_UserEntityRoles uer on uer.user_id = u.id and uer.active = '1' ";
$sql .= "join Security_EntityRoles er on er.id = uer.entity_role_id and er.active = '1' ";
$sql .= "join Security_Roles r on er.role_id = r.id and r.active = '1' ";
$sql .= "join Security_Entities e on e.id = er.entity_id and e.active = '1' ";
$sql .= "join Security_EntityRoleRights err on err.entityrole_id = er.id and err.active = '1' ";
$sql .= "join Security_Rights ri on ri.id = err.right_id and ri.active = '1' ";
$sql .= "where u.active = '1' and u.Token = '" . $_GET["token"] . "' and u.TokenExpires = '" . $_GET["tokenExpires"] . "' ";
$sql .= "order by e.name, r.name, ri.name;";

$rs = $conn->query($sql);
$rights = "";
$message = "";
if ($rs->num_rows > 0) {
	$entity = "";
	$role = "";
    while($row = $rs->fetch_assoc()) {
		if ($entity != $row["EntityName"]){
		    if ($rights > "")
                $rights .= "/></Role></Entity>";

			$rights .= "<Entity name='" . $row["EntityName"] . "'>";
			$entity = $row["EntityName"];
			$role = "";
		}
		if ($role != $row["RoleName"]){
		    if ($role > "")
                $rights .= "/></Role>";

			$rights .= "<Role name='" . $row["RoleName"] . "'><Rights ";
			$role = $row["RoleName"];
		}

		$rights .= $row["RightName"] . "='1' ";
    }
}
if ($rs->num_rows == 0) {
	$message = "Token combination not found";
	$rights = "<Entity><Role><Rights ";
}

$rights = "<root>"  . $rights . "/></Role></Entity>";
$rights .= "<Message text='" . $message . "' /></root>";
echo $rights;

$conn->close();
?>