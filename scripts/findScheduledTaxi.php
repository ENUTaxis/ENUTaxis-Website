<?php
/**
 *	findScheduledTaxi.php
 *
 *	What is it for?
 *		Here a description of what does this script
 *
 *	Parameters:
 *		- a list
 *		- of all parameters
 *		- that we need from the AJAX request
 */

/*
 * Create connection to the database
 */
include("databaseConnection.php");

/*
 * Needed parameters
 */
$matriculationNumber;

/*
 * Set value of parameters
 */
if( isset($_POST['matriculationNumber']) ) {

	if( is_numeric($_POST['matriculationNumber']) ) {
		$matriculationNumber = intval($_POST['matriculationNumber']);
	} else {
		$response['error'] = "Matriculation number is not numeric";
		echo json_encode($response);
		exit();
	}

} else {
	$response['error'] = "Missing parameters";
	echo json_encode($response);
	exit();
}

$response['matriculationNumber'] = $matriculationNumber;

// Get all bookings which matche with the given matriculation number
$query = "SELECT * FROM Jobs WHERE StudentID = '$matriculationNumber'";

// Execute the query
$result = mysql_query($query);
// Count how many lines are received
$rows   = mysql_num_rows($result);

$i = 0;
$response['studentName'] = "undefined";
while($row = mysql_fetch_assoc($result)) {
	$response['studentName'] = $row['StudentName'];
	$response['row'.$i] = $row;
	$i++;
}

$response['rows'] = $rows;
$response['result'] = $result;

/*
 * Encode all data in a JSON object
 * and send it as an AJAX response
 */
echo json_encode($response);

/*
 * Disconnect from the database
 */
include("databaseDisconnection.php");

?>