<?php
	try {
		if ($_SERVER['SERVER_NAME'] == "localhost"){
			$servername = "DESKTOP-PSN6TIK";
			$username = "MyDB1138";
			$password = "HeTaretEC2u!";
			$dbname = "mydb1138";
			//root:password
		}
		else{
			//$servername = "45.40.164.103"; //old windows server
			$servername = "107.180.41.155"; //new cpanel server
			$username = "MyDB1138";
			$password = "HeTaretEC2u!";
			$dbname = "MyDB1138";
		}

		// Create connection
		$conn = new mysqli($servername, $username, $password, $dbname);
		// Check connection
		if ($conn->connect_error) {
			die("Connection failed: " . $conn->connect_error);
		} 

		// get current time
		date_default_timezone_set('America/Chicago');
		$d = new DateTime();
		$sd = $d->format('m-d-Y H:i:s');
	}
	catch (Exception $e){
		echo "Caught exception: '" . $e->getMessage() . "'.";
	}

?>