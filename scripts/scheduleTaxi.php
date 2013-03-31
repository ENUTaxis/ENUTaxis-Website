<?php
/**
 *	scheduleTaxi.php
 *
 *	What is it for?
 *		Here a description of what does this script
 *
 *	Parameters:
 *		- a list
 *		- of all parameters
 *		- that we need from the AJAX request
 */

include("databaseConnection.php");

// SQL query to store first record where the driver is currently available
$result = mysql_query("SELECT DriverID FROM Driver_Table WHERE Available ="Y" LIMIT 1");

if ($result) {

	if (mysql_num_rows($content) < 1) {
		// if a driver is availbale query against the booking table to ensure there will be no overlapping jobs
		$booking = mysql_query("SELECT BookingTime BookingDate From Booking_Table WHERE DriverID = "$result"");
		
		if(mysql_num_rows($booking) != 0) {
			// set available to true if no results from previous query; load confirm page
			$available = true;
		} else {
			// query asap job google arrival time with booking time - 20 mins
			$arrivetime = strtotime();
			// time user has scheduled booking for
			$scheduletime = strtotime();
			// convert booking time string into time 
			$bookingtime = strtotime($booking);
			// SQL query to get time 20 minutes before bookingtime to allow driver time to get to job without any new jobs being allocated
			$oncall = mysql_query("SELECT SUBTIME('$bookingtime','0:20:0')");
			// check if new job doesnt over lap with booked job, if it doesn't load confirm page
			if (strtotime($arrivetime) < $oncall) {
				// mysql_query("INSERT INTO Job_Table ("/*fields and values in here*/")");
				// mysql_query("UPDATE Driver_Table SET Available="N" WHERE DriverID = "$result"");
				$available = true;
			} else if (($arrivetime) > $oncall) {
				// if there is over lap alert user of over lap and provide them with next available time
				// set available to false, alert user there are no drivers available
				$available = false;
			}
		}
	} else {
		// SQL query to find earliest finish time from job table if all drivers available
		$nextfinish = mysql_query("SELECT arrivaltime FROM Jobs WHERE arrivalTime=(SELECT MAX(ArrivalTime) FROM Jobs)");
		$nextfinishtime = strtotime("$nextfinish");
		// add 15 minutes to finish time of job to allow driver time to get to next pickup
		$nextpickup = mysql_query("SELECT ADDTIME('$nextfinishtime','0:15:0')")
	}
}
echo $available
echo $nextpickup

include("databaseDisconnection.php");

?>