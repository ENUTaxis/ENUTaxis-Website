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
			$booking = mysql_query($connection,"SELECT BookingDate BookingTime From Booking_Table WHERE DriverID = "$result"");
			
			if(mysql_num_rows($booking)!=0) {
				//set available to true if no results from previous query; load confirm page
				$available = true;
				//load confirm page
			} else {
				//query asap job google arrival time with booking time - 20 mins
				//convert time strings to time 
				$arrivetime = strtotime();
				//time/date the user has scheduled for
				//concatenate strings into one for time and date
				$scheduletime = strtotime();
				//time of booking driver is already allocated to
				$bookingtime = strtotime($booking);
				//time booked job is due to finish
				$bookingfinish = mysql_query($connection"SELECT finishtime FROM Job_Table WHERE Job_Table.JobID = Booking_Table.JobID");
				//sql query to get time 20 minutes before bookingtime to allow driver time to get to job without any new jobs being allocated
				$oncall = mysql_query($connection,"SELECT SUBTIME('$bookingtime','0:20:0')");
				//if there is overlap alert user of over lap and provide them with next available time
				if (($scheduletime <= $bookingfinish)&&($oncall <= $arrivetime)) {
					//set available to false, alert user there are no drivers available
					$available = false;
				} else {	
					//check if new job doesnt over lap with booked job, if it doesn't load confirm page
					// mysql_query($connection,"INSERT INTO Job_Table ("/*fields and values in here*/")");
					// mysql_query($connection,"UPDATE Driver_Table SET Available="N" WHERE DriverID = "$result"");
					$available = true;
					//load confirm page
				}
			}
		} else {
			//sql query to find earliest finish time from job table if all drivers unavailable
			$nextfinish = mysql_query($connection,"SELECT arrivaltime FROM Jobs WHERE arrivaltime=(SELECT MAX(ArrivalTime) FROM Jobs)");
			$nextfinishtime = strtotime("$nextfinish");
			//add 15 minutes to finish time of job to allow driver time to get to next pickup
			$nextpickup = mysql_query($connection,"SELECT ADDTIME('$nextfinishtime','0:15:0')")
		}
	}
	echo $available
	echo $nextpickup

	mysql_close($connection);
?>