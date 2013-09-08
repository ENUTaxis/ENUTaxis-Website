<?php
/**
 *	databaseDisconnection.php
 *
 *	What is it for?
 *		Close the MySQL connection with the server
 *		Handle errors if something happens during
 *		the disconnection
 */

$succeed = mysql_close();
if($succeed == false) {
	die("database disconnection error: " . mysql_error());
}

?>
