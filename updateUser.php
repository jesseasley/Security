<?php
    include("database.php");

// POST the user
if ($_POST["id"] == "0"){
	$sql = "insert into Security_Users (email, password, active) values (";
	$sql .= "'" . $_POST["email"] . "', ";
	$sql .= "'" . $_POST["password"] . "', ";
	$sql .= "'" . $_POST["active"] . "')";
}
else {
	if ($_POST["delete_user"] == "1"){
		$sql = "delete from Security_UserEntityRoles where user_id = " . $_POST["id"] . ";";
		if ($conn->query($sql) === TRUE)
			$sql = "delete from Security_Users where id = " . $_POST["id"] . ";";
		else
			echo "failed";
	}
	else{
		$sql = "update Security_Users set email = '" . $_POST["email"] . "', password='" . $_POST["password"] . "', ";
		$sql .= "active = '" . $_POST["active"] . "' where id = " . $_POST["id"];
	}
}

if ($conn->query($sql) === TRUE) 
	echo "success";
else
	echo "failed";

$conn->close();
?>