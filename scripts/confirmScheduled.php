<?php
/**
 *	confirmScheduled.php
 *
 *	What is it for?
 *		Receive all information about the booking from
 *		an AJAX communication and then, put these values
 *		in the database. 
 *		When the new row is in the database, the booking
 *		is confirmed. 
 *
 *	Parameters:
 *		- student name (string)
 *		- student phone (numeric)
 *		- student matriculation number (numeric)
 *		- location address (string)
 *		- destination address (string)
 *		- date/time when the user clicked on the confirm button (numeric timestamp)
 *		- price (numeric)
 *		- departure date/time (numeric timestamp)
 *		- arrival date/time (numeric timestamp)
 *		- duration in minutes (numeric)
 *		- number of passengers (numeric)
 *		- the ID of the driver (numeric)
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
$fromAddress;
$destinationAddress;
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
	isset($_POST['fromAddress']) &&
	isset($_POST['destinationAddress']) &&
	isset($_POST['dateTime']) &&
	isset($_POST['price']) &&
	isset($_POST['departureDateTime']) &&
	isset($_POST['arrivalDateTime']) &&
	isset($_POST['duration']) &&
	isset($_POST['passengers']) &&
	isset($_POST['driverId'])
  ) {

  	if( is_string($_POST['studentName']) ) {
		$studentName = $_POST['studentName'];
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

	if( is_string($_POST['fromAddress']) ) {
		$fromAddress = $_POST['fromAddress'];
	} else {
		$response['error'] = "The location address is not a correct string";
		echo json_encode($response);
		exit();
	}

	if( is_string($_POST['destinationAddress']) ) {
		$destinationAddress = $_POST['destinationAddress'];
	} else {
		$response['error'] = "The destination address is not a correct string";
		echo json_encode($response);
		exit();
	}

	if( is_numeric($_POST['dateTime']) ) {
		// convert timestamp from ms to seconds
		$dateTime = round( intval($_POST['dateTime']) / 1000 );
		$dateTime = new DateTime("@$dateTime", new DateTimeZone('Europe/London'));
		$dateTimeString = $dateTime->format('Y-m-d H:i:s');
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
		$departureDateTime = new DateTime("@$departureDateTime");
		$departureDateTime->modify('+0 hours'); // Fix bug with timezone => GMT+1
		$departureDateTimeString = $departureDateTime->format('Y-m-d H:i:s');
	} else {
		$response['error'] = "The timestamp of the departure is not numeric";
		echo json_encode($response);
		exit();
	}

	if( is_numeric($_POST['arrivalDateTime']) ) {
		// convert timestamp from ms to seconds
		$arrivalDateTime = round( intval($_POST['arrivalDateTime']) / 1000 );
		$arrivalDateTime = new DateTime("@$arrivalDateTime");
		$arrivalDateTime->modify('+0 hours'); // Fix bug with timezone => GMT+1
		$arrivalDateTimeString = $arrivalDateTime->format('Y-m-d H:i:s');
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

$studentEmail = $studentId."@live.napier.ac.uk";

$query = "INSERT INTO Jobs (StudentName, StudentPhone, StudentID, StudentEmail, NumberOfPassengers, FromAddress, ".
		 "DestinationAddress, Price, Duration, DriverId, ArrivalTime, DepartureTime, DateTime) VALUES (".
			"'".$studentName."', ".
			"'".$studentPhone."', ".
			"'".$studentId."', ".
			"'".$studentEmail."', ".
			"'".$passengers."', ".
			"'".$fromAddress."', ".
			"'".$destinationAddress."', ".
			"'".$price."', ".
			"'".$duration."', ".
			"'".$driverId."', ".
			"'".$arrivalDateTimeString."', ".
			"'".$departureDateTimeString."', ".
			"'".$dateTimeString."')";
// Execute the query
if($debug) {
	$response['studentName'] = $studentName;
	$response['studentPhone'] = $studentPhone;
	$response['studentId'] = $studentId;
	$response['studentEmail'] = $studentEmail;
	$response['passengers'] = $passengers;
	$response['fromAddress'] = $fromAddress;
	$response['destinationAddress'] = $destinationAddress;
	$response['price'] = $price;
	$response['duration'] = $duration;
	$response['driverId'] = $driverId;
	$response['arrivalDateTime'] = $arrivalDateTime;
	$response['departureDateTime'] = $departureDateTime;
	$response['dateTime'] = $dateTime;
	$response['query'] = $query;
}

$response['ok'] = true;
if(!mysql_query($query)) {
	$response['ok'] = false;
	$response['mysqlError'] = mysql_error();
}

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
