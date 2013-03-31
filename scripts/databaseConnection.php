<?php
/**
 *	databaseConnection.php
 *
 *	What is it for?
 *		Open a MySQL connection with the server
 *		Then select the correct database
 *		Handle errors if something happens during
 *		the connection and/or the selection
 */

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

