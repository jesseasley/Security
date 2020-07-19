<?php
    include("database.php");

// get the user
$sql = "e.name EntityName, r.name RoleName, ri.name RightName ";
$sql .= "from Security_Users u ";
$sql .= "join Security_UserEntityRoles uer on uer.user_id = u.id and uer.active = '1' ";
$sql .= "join Security_EntityRoles er on er.id = uer.entity_role_id and er.active = '1' ";
$sql .= "join Security_Roles r on er.role_id = r.id and r.active = '1' ";
$sql .= "join Security_Entities e on e.id = er.entity_id and e.active = '1' ";
$sql .= "join Security_EntityRoleRights err on err.entityrole_id = er.id and err.active = '1' ";
$sql .= "join Security_Rights ri on ri.id = err.right_id and ri.active = '1' ";

$sql = "select * from Security_Users order by email";
$rs = $conn->query($sql);
if ($rs->num_rows > 0) {
	$user = "";
    while($row = $rs->fetch_assoc()) {
		$user .= "      <User ID='" . $row["id"] . "' Email='" . $row["email"] . "' ";
		//$user .= "Password='" . $row["password"] . "' ImagePath='" . $row["image_path"] . "' ";
		$user .= "Active='" . $row["active"] . "' />\n";
    }
}
$user = "   <Users>\n" . $user . "   </Users>\n";

$sql = "select * from Security_Roles order by name";
$rs = $conn->query($sql);
if ($rs->num_rows > 0) {
	$role_m = "";
    while($row = $rs->fetch_assoc()) {
		$role_m .= "      <Role ID='" . $row["id"] . "' Name='" . $row["name"] . "' Active='" . $row["active"] . "' />\n";
    }
}
$role_m = "   <Roles>\n" . $role_m . "   </Roles>\n";

$sql = "select * from Security_Rights order by name";
$rs = $conn->query($sql);
if ($rs->num_rows > 0) {
	$right = "";
    while($row = $rs->fetch_assoc()) {
		$right .= "      <Right ID='" . $row["id"] . "' Name='" . $row["name"] . "' Active='" . $row["active"] . "' />\n";
    }
}
$right = "   <Rights>\n" . $right . "   </Rights>\n";

//get all entities
$sql = "select * from Security_Entities order by name";
$rs = $conn->query($sql);
if ($rs->num_rows > 0) {
	$entity = "";
    while($row = $rs->fetch_assoc()) {
		$entity .= "      <Entity ID='" . $row["id"] . "' Name='" . $row["name"] . "' Active='" . $row["active"] . "'>\n";
		
		//get the roles in this entity
		$sql = "select er.id, r.name, r.active from Security_EntityRoles er join Security_Roles r on ";
		$sql .= "r.id = er.role_id where er.entity_id = " . $row["id"] . " order by r.name";
		$rsRoles = $conn->query($sql);
		if ($rsRoles->num_rows > 0) {
			$role = "";
			while($rowRoles = $rsRoles->fetch_assoc()) {
				$role .= "            <Role ID='" . $rowRoles["id"] . "' Name='" . $rowRoles["name"] . "' Active='";
				$role .= $rowRoles["active"] . "' Rights='";
				
				//get the rights in this role
				$sql = "select right_id from Security_EntityRoleRights where entityrole_id = " . $rowRoles["id"];
				$rsRights = $conn->query($sql);
				while($rowRights = $rsRights->fetch_assoc()) {
					$role .= $rowRights["right_id"] . "|";
				}
				//$role = substr($role, 0, strlen($role) - 1);
				$role .= "' />\n";
			}
			$entity .= "         <Roles>\n" . $role . "         </Roles>\n      </Entity>\n";
		}
		$role = "   <Roles>\n" . $role . "   </Roles>\n";

    }
}
$entity = "   <Entities>\n" . $entity . "   </Entities>\n";

echo "<root>\n" . $user . $role_m . $right . $entity . "</root>";

$conn->close();
?>