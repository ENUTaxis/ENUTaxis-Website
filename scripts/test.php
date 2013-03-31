<?php
	include("databaseConnection.php");
	$username = $_POST['username'];
	/*echo "Il s'appel '$username'";*/

	$query = "SELECT * FROM Driver_Table";
	$response = mysql_query($query);
	while($row = mysql_fetch_assoc($response)) {
		echo $row["DriverName"];
	}
?>