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

include("databaseConnection.php");

// SQL query to store first record where the driver is currently available
$result = mysql_query("SELECT DriverID FROM Driver_Table WHERE Available ="Y" LIMIT 1");

if ($result) {

	if (mysql_num_rows($content) < 1) {
		// if a driver is availbale query against the booking table to ensure there will be no overlapping jobs
		$booking = mysql_query("SELECT BookingTime BookingDate From Booking_Table WHERE DriverID = "$result"");
		
		if(mysql_num_rows($booking)!=0) {
			// set available to true if no results from previous query; load confirm page
			$available = true;
			$email = "matNB"+"@live.napier.ac.uk";
			mysql_query("INSERT INTO Job_Table ("/*fields and values in here*/")");
			mysql_query("UPDATE Driver_Table SET Available="N" WHERE DriverID = "$result"");
		} else {
			// query asap job google arrival time with booking time - 20 mins

			// convert time strings to time 
			// google estimated time of arrival for new job
			$arrivetime = strtotime();
			// time/date the user has scheduled for
			// concatenate strings into one for time and date
			$scheduletime = strtotime();
			// time of booking driver is already allocated to
			$bookingtime = strtotime($booking);
			// time booked job is due to finish
			$bookingfinish = mysql_query("SELECT finishtime FROM Job_Table WHERE Job_Table.JobID = Booking_Table.JobID");
			// SQL query to get time 20 minutes before bookingtime to allow driver time to get to job without any new jobs being allocated
			$oncall = mysql_query("SELECT SUBTIME('$bookingtime','0:20:0')");
			// if there is overlap alert user of over lap and provide them with next available time
			if (($scheduletime <= $bookingfinish) && ($oncall <= $arrivetime)) {
				// set available to false and alert user that this slot has been taken between the time finding and confirming
				$available = false;
			} else {
				// check if new job doesnt over lap with booked job, if it doesn't insert to and update database
				$available = true;
				$email = "matNB"+"@live.napier.ac.uk";
				mysql_query("INSERT INTO Job_Table ("/*fields and values in here*/")");
				mysql_query("UPDATE Driver_Table SET Available="N" WHERE DriverID = "$result"");
			}
		}
	} else {
		// reload find page with values still stored in input boxes.
	}
}
echo $available
echo $nextpickup

include("databaseDisconnection.php");

?>