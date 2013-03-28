<?php
	$connection = mysql_connect("pma.olympe.in","GSn9I4gX","enutaxis","GSn9I4gX");
	if (mysql_connect_errno($connection)) {
		//alert user if unable to connect to database
		die('Could not connect to ENUT database, contact administrator: administrator@enutaxis.com' . mysql_error());
	}

	//sql query to store first record where the driver is currently available
	$result = mysql_query($connection,"SELECT DriverID FROM Driver_Table WHERE Available ="Y" LIMIT 1");

	if ($result) {

		if (mysql_num_rows($content)<1) {
			//if a driver is availbale query against the booking table to ensure there will be no overlapping jobs
			$booking = mysql_query($connection,"SELECT BookingTime BookingDate From Booking_Table WHERE DriverID = "$result"");
			
			if(mysql_num_rows($booking)!=0) {
				//set available to true if no results from previous query; load confirm page
				$available = true;
			} else {
				//query asap job google arrival time with booking time - 20 mins
				$arrivetime = strtotime();
				//time user has scheduled booking for
				$scheduletime = strtotime();
				//convert booking time string into time 
				$bookingtime = strtotime($booking);
				//sql query to get time 20 minutes before bookingtime to allow driver time to get to job without any new jobs being allocated
				$oncall = mysql_query($connection,"SELECT SUBTIME('$bookingtime','0:20:0')");
				//check if new job doesnt over lap with booked job, if it doesn't load confirm page
				if (strtotime($arrivetime) < $oncall) {
					// mysql_query($connection,"INSERT INTO Job_Table ("/*fields and values in here*/")");
					// mysql_query($connection,"UPDATE Driver_Table SET Available="N" WHERE DriverID = "$result"");
					$available = true;
				} else if (($arrivetime) > $oncall) {
					//if there is over lap alert user of over lap and provide them with next available time
					//set available to false, alert user there are no drivers available
					$available = false;
				}
			}
		} else {
			//sql query to find earliest finish time from job table if all drivers available
			$nextfinish = mysql_query($connection,"SELECT arrivaltime FROM Jobs WHERE arrivalTime=(SELECT MAX(ArrivalTime) FROM Jobs)");
			$nextfinishtime = strtotime("$nextfinish");
			//add 15 minutes to finish time of job to allow driver time to get to next pickup
			$nextpickup = mysql_query($connection,"SELECT ADDTIME('$nextfinishtime','0:15:0')")
		}
	}
	echo $available
	echo $nextpickup
	
	mysqli_close($connection);
?>