<?php 
	$hostname = "pma.olympe.in";
	$username = "GSn9I4gX";
	$password = "enutaxis";
	$database = "GSn9I4gX";
	$link = mysql_connect($hostname, $username, $password);
	if(!$link) {
		die("database connection error: " . mysql_error());
	}
	$db_selected = mysql_select_db($database, $link);
	if (!$db_selected) {
		die("database selection error: " . mysql_error());
	}
?>

