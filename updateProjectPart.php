<?php
    include("newFilename.php");
    include("encoding.php");
    include("database.php");
    include("compress.php");

    $json = "";
    $uploadOk = 1;
    //if pictureID = -1, this is a new upload, so add the pic to the server and get the new filename
    
    if ($_POST["editProjectPartID"] == "-1"){
        $target_file = newFilename("images/projects/");
        // Check file size
        if ($_FILES["editProjectPartGetPhoto"]["size"] > 1000000) {
            if ($json > "")
                $json .= ",";
            $json .= "{\"message\":\"That file is greater than the 1Mb limit.\"}";
            $uploadOk = 0;
        }

        // Check if $uploadOk is set to 0 by an error
        if ($uploadOk == 0) {
            if ($json > "")
                $json .= ",";
            $json .= "{\"message\":\"Your file was not uploaded. (" . basename($_FILES["editProjectPartGetPhoto"]["name"]) . ")\"}";

        // if everything is ok, try to upload file
        } else {
            if (compress($_FILES["editProjectPartGetPhoto"]["tmp_name"], "images\\projects\\" . $target_file)) {
                $sql = "insert into TrackMuse_UserProjectParts (title, description, pricepaid, vendorlink, ";
                $sql .= "ts, active, filename, projectid) values (";
                $sql .= "'" . encode($_POST["editProjectPartTitle"]) . "', ";
                $sql .= "'" . encode($_POST["editProjectPartDescription"]) . "', ";
                $sql .= "'" . encode($_POST["editProjectPartPrice"]) . "', ";
                $sql .= "'" . encode($_POST["editProjectPartVendor"]) . "', '";
                $sql .= $sd . "', '" . $_REQUEST["active"] . "', '" . $target_file . "', ";
                $sql .= "'" . $_POST["editProjectPartProjectID"] . "')";
                echo $sql;
                if ($conn->query($sql) === TRUE) {
                    echo "{\"image\": {\"message\": \"Project part successfully added.\"}}";
                } else {
                    echo "{\"image\": {\"error\": \"Error adding project part: " . $conn->error . "\"}}";
                }
            }
        }
    }
    else{
        //pictureID != -1, so just update the attributes
        $sql = "update TrackMuse_UserProjectParts ";
        $sql .= "set title = '" . encode($_POST["editProjectPartTitle"]) . "', ";
        $sql .= "description = '" . encode($_POST["editProjectPartDescription"]) . "', ";
        $sql .= "pricepaid = '" . encode($_POST["editProjectPartPrice"]) . "', ";
        $sql .= "vendorlink = '" . encode($_POST["editProjectPartVendor"]) . "', ";
        $sql .= "ts = '" . $sd . "', ";
        $sql .= "active = '" . $_REQUEST["active"] . "' ";
        $sql .= "where id= '" . $_POST["editProjectPartID"] . "'";
        if ($conn->query($sql) === TRUE) {
            echo "{\"image\": {\"message\": \"Project part successfully updated.\"}}";
        } else {
            echo "{\"image\": {\"error\": \"Error updating project part: " . $conn->error . "\"}}";
        }

    }


    $conn->close();
?>