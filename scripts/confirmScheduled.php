<?php
/**
 *	confirmScheduled.php
 *
 *	What is it for?
 *		Here a description of what does this script
 *
 *	Parameters:
 *		- a list
 *		- of all parameters
 *		- that we need from the AJAX request
 */

$debug = false;

/*
 * Create connection to the database
 */
include("databaseConnection.php");

/*
 * Needed parameters
 */
$studentName;
$studentId;
$studentPhone;
$fromHouseNumber;
$fromStreetName;
$fromPostcode;
$destinationHouseNumber;
$destinationStreetName;
$destinationPostcode;
$dateTime;
$price;
$departureDateTime;
$arrivalDateTime;
$duration;
$passengers;
$driverId;

/*
 * Set value of parameters
 */
if( isset($_POST['studentName']) &&
	isset($_POST['studentId']) &&
	isset($_POST['studentPhone']) &&
	isset($_POST['fromHouseNumber']) &&
	isset($_POST['fromStreetName']) &&
	isset($_POST['fromPostcode']) &&
	isset($_POST['destinationHouseNumber']) &&
	isset($_POST['destinationStreetName']) &&
	isset($_POST['destinationPostcode']) &&
	isset($_POST['dateTime']) &&
	isset($_POST['price']) &&
	isset($_POST['departureDateTime']) &&
	isset($_POST['arrivalDateTime']) &&
	isset($_POST['duration']) &&
	isset($_POST['passengers']) &&
	isset($_POST['driverId'])
  ) {

  	if( is_string($_POST['studentName']) ) {
		$studentName = $_POST['studentName']);
	} else {
		$response['error'] = "Student name is not a correct string";
		echo json_encode($response);
		exit();
	}

	if( is_numeric($_POST['studentId']) ) {
		$studentId = intval($_POST['studentId']);
	} else {
		$response['error'] = "Matriculation number is not numeric";
		echo json_encode($response);
		exit();
	}

	if( is_numeric($_POST['studentPhone']) ) {
		$studentPhone = intval($_POST['studentPhone']);
	} else {
		$response['error'] = "Student phone number is not numeric";
		echo json_encode($response);
		exit();
	}

	if( is_numeric($_POST['fromHouseNumber']) ) {
		$fromHouseNumber = intval($_POST['fromHouseNumber']);
	} else {
		$response['error'] = "The location house number is not numeric";
		echo json_encode($response);
		exit();
	}

	if( is_string($_POST['fromStreetName']) ) {
		$fromStreetName = $_POST['fromStreetName']);
	} else {
		$response['error'] = "The location street name is not a correct string";
		echo json_encode($response);
		exit();
	}

	if( is_string($_POST['fromPostcode']) ) {
		$fromPostcode = $_POST['fromPostcode']);
	} else {
		$response['error'] = "The location postcode is not a correct string";
		echo json_encode($response);
		exit();
	}

	if( is_numeric($_POST['destinationHouseNumber']) ) {
		$destinationHouseNumber = intval($_POST['destinationHouseNumber']);
	} else {
		$response['error'] = "The destination house number is not numeric";
		echo json_encode($response);
		exit();
	}

	if( is_string($_POST['destinationStreetName']) ) {
		$destinationStreetName = $_POST['destinationStreetName']);
	} else {
		$response['error'] = "The destination street name is not a correct string";
		echo json_encode($response);
		exit();
	}

	if( is_string($_POST['destinationPostcode']) ) {
		$destinationPostcode = $_POST['destinationPostcode']);
	} else {
		$response['error'] = "The destination postcode is not a correct string";
		echo json_encode($response);
		exit();
	}

	if( is_numeric($_POST['dateTime']) ) {
		// convert timestamp from ms to seconds
		$dateTime = round( intval($_POST['dateTime']) / 1000 );
	} else {
		$response['error'] = "The timestamp of the booking is not numeric";
		echo json_encode($response);
		exit();
	}

	if( is_numeric($_POST['price']) ) {
		$price = intval($_POST['price']);
	} else {
		$response['error'] = "The price is not numeric";
		echo json_encode($response);
		exit();
	}

	if( is_numeric($_POST['departureDateTime']) ) {
		// convert timestamp from ms to seconds
		$departureDateTime = round( intval($_POST['departureDateTime']) / 1000 );
	} else {
		$response['error'] = "The timestamp of the departure is not numeric";
		echo json_encode($response);
		exit();
	}

	if( is_numeric($_POST['arrivalDateTime']) ) {
		// convert timestamp from ms to seconds
		$arrivalDateTime = round( intval($_POST['arrivalDateTime']) / 1000 );
	} else {
		$response['error'] = "The timestamp of the arrival is not numeric";
		echo json_encode($response);
		exit();
	}

	if( is_numeric($_POST['duration']) ) {
		$duration = intval($_POST['duration']);
	} else {
		$response['error'] = "The duration is not numeric";
		echo json_encode($response);
		exit();
	}

	if( is_numeric($_POST['passengers']) ) {
		$passengers = intval($_POST['passengers']);
	} else {
		$response['error'] = "Number of passengers is not numeric";
		echo json_encode($response);
		exit();
	}

	if( is_numeric($_POST['driverId']) ) {
		$driverId = intval($_POST['driverId']);
	} else {
		$response['error'] = "The driver ID is not numeric";
		echo json_encode($response);
		exit();
	}

} else {
	$response['error'] = "Missing parameters";
	echo json_encode($response);
	exit();
}

// $email = "matNB"+"@live.napier.ac.uk";
// mysql_query("INSERT INTO Job_Table ("/*fields and values in here*/")");
// mysql_query("UPDATE Driver_Table SET Available="N" WHERE DriverID = "$result"");

include("databaseDisconnection.php");

?>