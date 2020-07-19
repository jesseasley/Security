<?php
    include("database.php");

// get the user
$sql = "select count(*) cnt from Security_Roles r join Security_EntityRoles er on r.id = er.role_id where r.name = '";
$sql .= $_REQUEST["role"] . "' and er.entity_id = " . $_REQUEST["entity_id"];
$rs = $conn->query($sql);
$row = $rs->fetch_assoc();
if ($row["cnt"] == "0"){
	//add the role
	$sql = "insert into Security_Roles (name, active) values ('" . $_REQUEST["role"] . "', '1')";
	if ($rs = $conn->query($sql)){
		$sql = "select max(id) max_id from Security_Roles";
		if ($rs = $conn->query($sql)){
			$row = $rs->fetch_assoc();
			
			//tie the role to the entity
			$sql = "insert into Security_EntityRoles (entity_id, role_id, active) values (" . $_REQUEST["entity_id"];
			$sql .= ", " . $row["max_id"] . ", '1')";
			if ($rs = $conn->query($sql)){

				//get the new ID
				$sql = "select max(id) max_id from Security_EntityRoles";
				if ($rs = $conn->query($sql)){
					$row = $rs->fetch_assoc();
				
					//add the rights
					$sql = "insert into Security_EntityRoleRights (entityrole_id, right_id, active) ";
					$sql .= "select '". $row["max_id"] . "', right_id, active from Security_EntityRoleRights ";
					$sql .= "where entityrole_id = " . $_REQUEST["id"];
					if ($rs = $conn->query($sql)){
						echo "success";
					}
					else{
						echo "Something went wrong adding the entity role rights";
					}
				}
			}
			else{
				echo "Something went wrong adding the entity role";
			}
		}
		else{
			echo "Missing role";
		}
	}
	else{
		echo "Failed to add role";
	}
}
else
	echo "The " . $_REQUEST["role"] . " role already exists for " . $_REQUEST["entity"];

$conn->close();
?>