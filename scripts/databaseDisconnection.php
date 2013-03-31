<?php
	$succeed = mysql_close();
	if($succeed == false) {
		die("database disconnection error: " . mysql_error());
	}
?>