<?php
	mysql_connect("pma.olympe.in","GSn9I4gX","enutaxis","GSn9I4gX");
	mysqli_query("UPDATE Driver_Table SET Available='N' WHERE (SELECT BookingTime FROM Booking_Table WHERE DATE(SELECT SUBTIME(BookingTime,'0:20:0')) >= NOW()");
	mysql_query("DELETE FROM Booking_Table WHERE (SELECT DriverID FROM Job_table WHERE finishtime >= NOW())=DriverID");
	mysqli_close();
?>