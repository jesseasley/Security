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
$sql .= "where u.active = '1' and u.email = '" . $_GET["email"] . "' and u.password = '" . $_GET["password"] . "'";
$sql .= "order by e.name, r.name, ri.name;";

$rs = $conn->query($sql);
$rights = "";
$message = "";
if ($rs->num_rows > 0) {
	$guid = sprintf('%04X%04X-%04X-%04X-%04X-%04X%04X%04X', mt_rand(0, 65535), mt_rand(0, 65535), mt_rand(0, 65535), mt_rand(16384, 20479), mt_rand(32768, 49151), mt_rand(0, 65535), mt_rand(0, 65535), mt_rand(0, 65535));
	$sql = "update Security_Users set Token = '" . $guid . "', TokenExpires=DATE_FORMAT(DATE_ADD(now(),Interval 1 DAY), '%m-%d-%Y %T') ";
	$sql .= "where active = '1' and email = '" . $_GET["email"] . "' and password = '" . $_GET["password"] . "'";
	//echo $sql . "\n\n";
	$conn->query($sql);
	$entity = "";
	$role = "";
    while($row = $rs->fetch_assoc()) {
		if ($entity != $row["EntityName"]){
		    if ($rights > "")
                $rights .= "/>\n      </Role>\n   </Entity>\n";

			$rights .= "   <Entity name='" . $row["EntityName"] . "'>";
			$entity = $row["EntityName"];
			$role = "";
		}
		if ($role != $row["RoleName"]){
		    if ($role > "")
                $rights .= "/>\n      </Role>";

			$rights .= "\n      <Role name='" . $row["RoleName"] . "'>\n         <Rights ";
			$role = $row["RoleName"];
		}

		$rights .= $row["RightName"] . "='1' ";
    }
}
if ($rights == ""){
	$rights = "<Entity>\n   <Role>\n      <Rights ";
	$sql = "select ";
	$sql .= "u.email ";
	$sql .= "from Security_Users u ";
	$sql .= "where u.active = '1' and u.email = '" . $_GET["email"] . "' and u.password = '" . $_GET["password"] . "';";

	$rs = $conn->query($sql);
	if ($rs->num_rows == 0) 
		$message = "Email/password combination does not exist.";
}

$rights = "<root>\n"  . $rights . "/>\n      </Role>\n   </Entity>\n";

$sql = "select Token, TokenExpires from Security_Users ";
$sql .= "where active = '1' and email = '" . $_GET["email"] . "' and password = '" . $_GET["password"] . "'";
//echo $sql . "\n\n";
$rs = $conn->query($sql);
$row = $rs->fetch_assoc();

$rights .= "   <Message text='" . $message . "' />\n   <Token value='" . $row["Token"] . "' expires='";
$rights .= $row["TokenExpires"] . "' />\n</root>";
echo $rights;

$conn->close();
?>