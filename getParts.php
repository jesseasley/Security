<?php
    include("database.php");

// get the user
$sql = "select upp.ts, upp.id, upp.filename, concat('images/projects/', upp.filename) fullpath,  ";
$sql .= "up.name title, upp.description, upp.projectID  ";
$sql .= "from TrackMuse_UserProjectParts upp  ";
$sql .= "join TrackMuse_UserProjects up on up.id = upp.projectid ";
$sql .= "where upp.active = '1' order by ts desc; ";

$rs = $conn->query($sql);
$parts = "";
if ($rs->num_rows > 0) {
    while($row = $rs->fetch_assoc()) {
        $pos = strpos($parts, $row["filename"]);
        if ($pos === false){
            if ($parts > "")
                $parts .= ",";
            $parts .= "{'id': '" . $row["id"] . "', 'fullpath': '" . $row["fullpath"];
            $parts .= "', 'title': '" . $row["title"] . "', 'description': '" . $row["description"];
            $parts .= "', 'projectID': '" . $row["projectID"] . "', 'filename': '" . $row["filename"] . "'}";
        }
    }
}
$parts = "({'parts': ["  . $parts . "]})";
echo $parts;

$conn->close();
?>