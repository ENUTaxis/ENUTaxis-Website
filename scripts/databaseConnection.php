<?php 
	$hostname = "pma.olympe.in";
	$username = "GSn9I4gX";
	$password = "enutaxis";
	$database = "GSn9I4gX";
	$link = mysql_connect($hostname, $username, $password);
	if(!$link) {
		die("db connect error");
	}
	$db_selected = mysql_select_db($database, $link);
	if (!$db_selected) {
		die("db select error");
	}
?>

