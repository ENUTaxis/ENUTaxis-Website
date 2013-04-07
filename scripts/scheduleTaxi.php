<?php
/**
 *	scheduleTaxi.php
 *
 *	What is it for?
 *		Look at the 'Jobs' table in the database
 *		to find all drivers busy between the departure
 *		and the arrival time (received as parameters)
 *		Then look at the 'Drivers' table to find if a
 *		driver is available for this time slot
 *
 *	Parameters:
 *		- departure time (milliseconds timestamp)
 *		- journey duration in minutes
 *		- number of people in the taxi
 *		- boolean if it's an As-Soon-As-Possible booking
 */

$debug = false;

/*
 * Create connection to the database
 */
include("databaseConnection.php");

/*
 * Needed parameters
 */
$departureTimestamp;
$duration;
$passengers;
$isAsap;

/*
 * Set value of parameters
 */
if( isset($_POST['departureTimestamp']) &&
	isset($_POST['duration']) &&
	isset($_POST['passengers']) &&
	isset($_POST['isAsap'])
  ) {

	if( is_numeric($_POST['departureTimestamp']) ) {
		// convert timestamp from ms to seconds
		$departureTimestamp = round( intval($_POST['departureTimestamp']) / 1000 );
	} else {
		$response['error'] = "Departure timestamp is not numeric";
		echo json_encode($response);
		exit();
	}

	if( is_numeric($_POST['duration']) ) {
		$duration = intval($_POST['duration']);
	} else {
		$response['error'] = "Duration is not numeric";
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

	if( is_string($_POST['isAsap']) ) {
		$isAsap = $_POST['isAsap'];
	} else {
		$response['error'] = "There is something wrong with the ASAP feature: ".$_POST['isAsap'];
		echo json_encode($response);
		exit();
	}

} else {
	$response['error'] = "Missing parameters";
	echo json_encode($response);
	exit();
}

/*
 * Calcul the arrival time from the departure timestamp
 * and the duration (in minutes)
 */
// Departure time
	$departureDateTime = new DateTime("@$departureTimestamp", new DateTimeZone('Europe/London'));
	$response['departureDateTime'] = $departureDateTime->format('Y-m-d H:i:s');
// Departure time minus 20 minutes (only if not ASAP)
	$departureDateTimeMinus20 = clone $departureDateTime;
	if($isAsap === "false") $departureDateTimeMinus20->modify('-20 minutes');
	$response['departureDateTimeMinus20'] = $departureDateTimeMinus20->format('Y-m-d H:i:s');
// Arrival time
	$arrivalDateTime = clone $departureDateTime;
	$arrivalDateTime->modify('+'.$duration.' minutes');
	$response['arrivalDateTime'] = $arrivalDateTime->format('Y-m-d H:i:s');
// Create string type of all date/time variables for the query
	$departureDateTimeString		= $departureDateTime->format('Y-m-d H:i:s');
	$departureDateTimeMinus20String	= $departureDateTimeMinus20->format('Y-m-d H:i:s');
	$arrivalDateTimeString			= $arrivalDateTime->format('Y-m-d H:i:s');

// Get all drivers (DriverId) busy between the departure and the arrival time
$query = "SELECT DriverId FROM Jobs WHERE DepartureTime <= '$arrivalDateTimeString' AND ArrivalTime >= '$departureDateTimeMinus20String'";

// Execute the query
$result = mysql_query($query);
// Count how many lines are received
$rows   = mysql_num_rows($result);

/*
 * Get the list of avaible drivers (DriverId)
 * from the list of drivers busy
 *
 * The query string is made depending on the
 * number of drivers busy and on the number
 * of passengers available in the taxi
 */
$query = "SELECT * FROM Drivers";
$firstLoop = true;
while($row = mysql_fetch_assoc($result)) {
	if($firstLoop) {
		$firstLoop = false;
		$query .= " WHERE DriverId != '".$row['DriverId']."'";
	} else {
		$query .= " AND DriverId != '".$row['DriverId']."'";
	}	
}
if($firstLoop)  $query .= " WHERE Passengers >= '".$passengers."'";
else 			$query .= " AND Passengers >= '".$passengers."'";

// Execute the query
$result = mysql_query($query);
// Count how many lines are received
$rows   = mysql_num_rows($result);

if($rows < 1) {
	/*
	 * No driver available
	 * Put the error on the JSON response
	 */
	$response['error'] = "No driver available";
} else {
	/*
	 * If, at least, one driver is available
	 * Put information about the first available
	 * driver on the JSON response
	 */
	$driver = mysql_fetch_assoc($result);
	$response['driverName'] = $driver['DriverName'];
	$response['driverId']   = $driver['DriverId'];
	$response['passengers'] = $driver['Passengers'];
	$response['price']      = "4.54";
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