/*
 * General variables
 */
 	var debug = true;
 	var isResultViewDisplayed = false;

	// Calendar
	var calendarDisplayed = false;
	var onSelectFired	  = false;

	// Google Maps
	var mapExpanded = false;
	var map;

	// Geocoder
	var geocoder;

	// Direction Service + Renderer
	var directionsService;
	var directionsRenderer;

	// Markers
	var isFromMarkerSet = false;
	var isToMarkerSet   = false;
	var fromMarker;
	var toMarker;
	var bounds;

	// Locations
	var Edinburgh;

	// User information
	
	
	var destinationAddress = null;
	var fromAddress        = null;
	var arrivalDateTime    = null;
	var departureTime      = null;
	var phoneNumber        = null;
	var passengers      = 1;
	var matNumber       = null;
	var duration        = null;
	var distance        = null;
	var fullName        = null;
	var dateTime        = null;
	var driverId        = null;
	var isAsap          = null;
	var price           = null;

/*
 * General JS functions
 */
$(function() {
	initializeTheMap();
	handleMenuAndBoxes();
	handleDropdownList();
	handleMapButton();
	handleInitAndClickOnCalendar();
	handleTimeButtons();
	handleFindButton();
	handleConfirmButton();
	autocompleteInputFieldsUsingGeocoder();
});

function handleMenuAndBoxes() {
	/*
	 * Hide table in Bookings list
	 */
	$('#my-bookings-result').hide();

	/*
	 * Hide all information boxes
	 */
	$('#howto-box').hide();
	$('#about-box').hide();
	$('#booking-box').hide();
	$('#contact-box').hide();

	/*
	 * Close the box when the cross is clicked
	 */
	$('.alert .close').click(function(e) {
    	$(this).parent().hide(400);
	});

	/*
	 * Home-link hides all boxes
	 */
	$('#home-link').click(function() {
		$('#howto-box').hide(400);
		$('#about-box').hide(400);
		$('#booking-box').hide(400);
		$('#contact-box').hide(400);

		$('#howto-link').removeClass("actif");
		$('#about-link').removeClass("actif");
		$('#booking-link').removeClass("actif");
		$('#contact-link').removeClass("actif");

		$('#home-link').addClass("actif");

		return false;
	});

	/*
	 * About-link displays about-box
	 */
	$('#about-link').click(function() {
		$('#howto-box').hide(400);
		$('#booking-box').hide(400);
		$('#contact-box').hide(400);

		$('#about-box').show(400);

		$('#home-link').removeClass("actif");
		$('#howto-link').removeClass("actif");
		$('#booking-link').removeClass("actif");
		$('#contact-link').removeClass("actif");

		$('#about-link').addClass("actif");

		return false;
	});

	/*
	 * Contact-link displays contact-box
	 */
	$('#contact-link').click(function() {
		$('#howto-box').hide(400);
		$('#about-box').hide(400);
		$('#booking-box').hide(400);

		$('#contact-box').show(400);

		$('#home-link').removeClass("actif");
		$('#howto-link').removeClass("actif");
		$('#about-link').removeClass("actif");
		$('#booking-link').removeClass("actif");

		$('#contact-link').addClass("actif");

		return false;
	});

	/*
	 * Howto-link displays howto-box
	 */
	$('#howto-link').click(function() {
		$('#about-box').hide(400);
		$('#booking-box').hide(400);
		$('#contact-box').hide(400);

		$('#howto-box').show(400);

		$('#home-link').removeClass("actif");
		$('#about-link').removeClass("actif");
		$('#contact-link').removeClass("actif");
		$('#booking-link').removeClass("actif");

		$('#howto-link').addClass("actif");
		
		return false;
	});

	/*
	 * Booking-link displays booking-box
	 */
	$('#booking-link').click(function() {
		$('#about-box').hide(400);
		$('#howto-box').hide(400);
		$('#contact-box').hide(400);

		$('#booking-box').show(400);

		$('#home-link').removeClass("actif");
		$('#about-link').removeClass("actif");
		$('#howto-link').removeClass("actif");
		$('#contact-link').removeClass("actif");

		$('#booking-link').addClass("actif");

		$('#matriculation-number').focus();
		
		return false;
	});

	/*
	 * A click on the address mail opens a new window
	 */
	$("a[data-mailto]").click(function(){
		var link = 'mailto:' + $(this).data('mailto');
		window.open(link, 'Mailer');
		return false;
	});

	/*
	 * A click on the "Find my Bookings" executes an
	 * AJAX communication to get the bookings of the
	 * corresponding matriculation number
	 */
	$('#bookings-btn').click(function() {
		var matriculationNumber = $('#matriculation-number').val();

		if(matriculationNumber.length == 8 && !isNaN(matriculationNumber)) {
			$.ajax({
				type: 'POST',
				url:  'scripts/findScheduledTaxi.php',
				data: { matriculationNumber: matriculationNumber }
			}).done(function(JSONdata) {
				console.log('JSON object received');
				var obj = JSON.parse(JSONdata);
				if(obj.hasOwnProperty('error')) {
					displayFormView();
					$.error(obj.error);
					displayErrorBox(obj.error);
				} else {
					$('#my-bookings-form').hide();
					$('#my-bookings-result').show();
					$('#my-bookings-result p').html(
						'Hi <b>' + obj.studentName + '</b><br>' +
						'Your matriculation number is <b>' + obj.matriculationNumber + '</b>');
					for(var i = 0; i < obj.rows; i++) {
						var depAdr = obj['row' + i].FromAddress.toString().split(',')[0] + 
									 obj['row' + i].FromAddress.toString().split(',')[1];
						var arrAdr = obj['row' + i].DestinationAddress.toString().split(',')[0] + 
									 obj['row' + i].DestinationAddress.toString().split(',')[1];
						$('#bookings-list tbody').append(
							'<tr>' + 
								'<td>' + obj['row' + i].DepartureTime + '</td>' + 
								'<td>' + obj['row' + i].ArrivalTime + '</td>' + 
								'<td>' + depAdr + '</td>' +
								'<td>' + arrAdr + '</td>' +
								'<td>' + obj['row' + i].Duration + '</td>' +
								'<td><input type="button" class="btn btn-danger" value="Remove" id=remove-' + obj['row' + i].JobID + '></td>' +
							'</tr>');
					}

					$('#my-bookings-result input[type="button"]').click(function(item) {
						console.log(item.delegateTarget.id);
						console.log(item.delegateTarget.id.split('-')[1]);

						// AJAX request here ! 

					});
				}
			});
		} else {
			displayErrorBox('Enter a correct matriculation number');
			return false;
		}
	});
}

function handleDropdownList() {
	$('select').change(function() {
		passengers = $('select[name="number"] option:selected').val();
	});
}

function handleTimeButtons() {
	$("#asap").click(function() {
		isAsap = true;
		departureTime = $.now() + 20*60*1000; // now + 20 minutes
		tempDate = new Date(departureTime);
		$('#chosenDate').html(
			tempDate.getMonth()+1 + '/' + tempDate.getDate() + '/' + tempDate.getFullYear() + ' ' +
			tempDate.getHours() + ':' + tempDate.getMinutes() + ' (in 20 minutes)'
			);
		hideCalendar();
	});
	$("#selectDateTime").click(function() {
		showCalendar();
	});
}

function handleFindButton() {
	$("#find-btn").click(function() {
		/*
		 * The form view is currently displayed
		 * Execute an AJAX communication and then
		 * display the responce on the result view
		 */
		if(!isResultViewDisplayed) {
			/*
			 * Check if all needed information are set
			 */
			if(!(fullName = checkName())) {
				$.error('full name unknown');
				return;
			}
			if(!(phoneNumber = checkPhoneNumber())) {
				$.error('phone number unknown');
				return;
			}
			if(!(matNumber = checkMatriculationNumber())) {
				$.error('matriculation number unknown');
				return;
			}
			if(departureTime == null) {
				displayErrorBox("Departure time has not been set");
				$.error("departure time unknown");
				return;
			}		
			if(duration == null) {
				displayErrorBox("Location and destination has not been set"),
				$.error("duration unknown");
				return;
			}
			if(distance == null) {
				$.error("distance unknown");
			}

			if(debug) {
				console.log('Customer full name: ' + fullName);
				console.log('Customer phone number: ' + phoneNumber);
				console.log('Customer matriculation number: ' + matNumber);
				console.log('Departure time (timestamp): ' + departureTime);
				console.log('Duration (minutes): ' + duration);
				console.log('Distance (meters): ' + distance);
				console.log('Is ASAP checked: ' + isAsap);
				console.log('Number of passengers in the taxi: ' + passengers);
			}

			displayResultView();

			/*
			 * Create an AJAX connection to find an available taxi
			 */
			$.ajax({
				type: 'POST',
				url:  'scripts/scheduleTaxi.php',
				data: {
					departureTimestamp: departureTime,
					duration: duration,
					distance: distance,
					passengers: passengers,
					isAsap: isAsap
				}
			}).done(function(JSONdata) {
				console.log('JSON object received');
				var obj = JSON.parse(JSONdata);
				if(obj.hasOwnProperty('error')) {
					displayFormView();
					$.error(obj.error);
					displayErrorBox(obj.error);
				} else {
					$('#loading-logo').hide();
					$('#result').html('Driver name: ' + obj.driverName + 
									  '<br>Max passengers available: ' + obj.passengers +
									  '<br>Departure time: ' + obj.departureDateTime + 
									  '<br>Arrival time: ' + obj.arrivalDateTime +
									  '<br>Cost: £' + obj.price);
					price = obj.price;	
					// Convert from String to Timestamp
					departureTime = new Date(obj.departureDateTime).valueOf(); 
					arrivalDateTime = new Date(obj.arrivalDateTime).valueOf();
					driverId = obj.driverId;
				}
			});
		}

		/*
		 * The result view is currently displayed
		 * Go back to the form view
		 */
		else {
			displayFormView();
		}
	});
}

function handleConfirmButton() {
	$('#confirm-btn').click(function() {
		dateTime = $.now();
		$.ajax({
			type: 'POST',
			url:  'scripts/confirmScheduled.php',
			data: {
				studentName:        fullName,
				studentId:          matNumber,
				studentPhone:       phoneNumber,
				fromAddress:        fromAddress,
				destinationAddress: destinationAddress,
				dateTime:           dateTime,
				price:              price,
				departureDateTime:  departureTime,
				arrivalDateTime:    arrivalDateTime,
				duration:           duration,
				passengers:         passengers,
				driverId:           driverId
			}
		}).done(function(JSONdata) {
			console.log('JSON object received');
			var obj = JSON.parse(JSONdata);
			if(obj.hasOwnProperty('error')) {
				displayFormView();
				$.error(obj.error);
				displayErrorBox(obj.error);
			} else {
				if(obj.ok == false) {
					$.error(obj.mysqlError);
				} else {
					console.log("Succeed for booking");
					console.log(obj);
				}
			}
		});
	});
}

/*
 * Methods to control/manage the Google Maps widget
 */
function initializeTheMap() {
	Edinburgh = new google.maps.LatLng( 55.973414,-3.188782 );

	var mapOptions = {
		center: Edinburgh,
		mapTypeId: google.maps.MapTypeId.ROADMAP,
		disableDoubleClickZoom: true,
		streetViewControl: false,
		navigationControl: false,
		mapTypeControl: false,
		scaleControl: false,
		scrollwheel: false,
		draggable: false,
		zoom: 12
	};
	
	map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);

	/*
	 * Create two Markers and add it to the Map (not visible)
	 */
	fromMarker = new google.maps.Marker({
		position: Edinburgh,
		title:"Departure flag"
	});
	toMarker = new google.maps.Marker({
		position: Edinburgh,
		title:"Arrival flag"
	});
	fromMarker.setVisible(false);
	toMarker.setVisible(false);
	fromMarker.setMap(map);
	toMarker.setMap(map);

	/*
	 * Objects that calculates and draw the route between two points
	 */
	directionsService = new google.maps.DirectionsService();
	directionsRenderer  = new google.maps.DirectionsRenderer({
		draggable: true,
		hideRouteList: true,
		map: map
	});

	/*
	 * LatLngBounds to make a zoom that show all Makers
	 */
	bounds = new google.maps.LatLngBounds();

	/*
	 * onClick listenner to put Markers
	 */
	google.maps.event.addListener(map, 'click', function(event) {
		if(!mapExpanded) return;
		if(!isFromMarkerSet) {
			fromMarker.setPosition(event.latLng);
			fromMarker.setVisible(true);
			isFromMarkerSet = true;
			geocoder.geocode( {'latLng': fromMarker.getPosition() }, function(results, status) {
				if (status == google.maps.GeocoderStatus.OK) {
					var address = selectStreetAddress(results);
					if(address != false)
						fillFormFromMarkers(address, true);
				} else {
					console.log("There was an error in your request. Requeststatus: " + status);
				}
			});
		} else if(!isToMarkerSet) {
			toMarker.setPosition(event.latLng);
			toMarker.setVisible(true);
			isToMarkerSet = true;
			geocoder.geocode( {'latLng': toMarker.getPosition() }, function(results, status) {
				if (status == google.maps.GeocoderStatus.OK) {
					var address = selectStreetAddress(results);
					if(address != false)
						fillFormFromMarkers(address, false);
				} else {
					console.log("There was an error in your request. Requeststatus: " + status);
				}
			});
		}

		/*
		 * When the location and destination is set
		 * draw the route on the Map
		 * and set the duration in minute
		 */
		if(isFromMarkerSet && isToMarkerSet) {
			drawRouteOnTheMap();
		}
	});

	/*
	 * Listenner when direction is changed
	 */
	google.maps.event.addListener(directionsRenderer, 'directions_changed', function(event) {
		console.log("Direction changed");
		var fromLocation = directionsRenderer.getDirections().routes[0].legs[0].start_location;
		var toLocation   = directionsRenderer.getDirections().routes[0].legs[0].end_location;
		geocoder.geocode( {'latLng': fromLocation }, function(results, status) {
			if (status == google.maps.GeocoderStatus.OK) {
				var address = selectStreetAddress(results);
				if(address != false)
					fillFormFromMarkers(address, true);
			} else {
				$.error("There was an error in your request. Requeststatus: " + status);
			}
		});
		geocoder.geocode( {'latLng': toLocation }, function(results, status) {
			if (status == google.maps.GeocoderStatus.OK) {
				var address = selectStreetAddress(results);
				if(address != false)
					fillFormFromMarkers(address, false);
			} else {
				$.error("There was an error in your request. Requeststatus: " + status);
			}
		});
	});
}

function handleMapButton() {
	$("#expand-button").click(function() {
		console.log("expand-button fired");

		// Hide the expand button
		$("#expand-button").fadeTo(400, 0, function() {
			$("#expand-button").hide();

			// Make the Google Map bigger
			$("#map-container").height(450);
			$("#map-canvas").height(450);

			// Display the minimize button
			$("#minimize-button").show();

			if(isFromMarkerSet && isToMarkerSet)
				setTimeout(drawRouteOnTheMap, 500);
			else
				setTimeout(refreshMap, 500);

			enableGMapControl();
			mapExpanded = true;
		});
	});

	$("#minimize-button").click(function() {
		console.log("minimize-button fired");

		disableGMapsControl();

		// Hide the minimize button
		$("#minimize-button").fadeOut(600, 0, function() {
			$("#minimize-button").hide();
		});

		// Make the Google Map smaller
		$("#map-container").height(300);
		$("#map-canvas").height(300);

		// Display the expand button
		$("#expand-button").show();
		$("#expand-button").delay(700).fadeTo(500, 1);

		if(isFromMarkerSet && isToMarkerSet)
			setTimeout(drawRouteOnTheMap, 500);
		mapExpanded = false;
	});
}

function refreshMap()
{
	console.log("refresh the G.Maps");
    google.maps.event.trigger(map, 'resize');
}

function disableGMapsControl() {
	var mapOptions = {
		disableDoubleClickZoom: true,
		navigationControl: false,
		scaleControl: false,
		scrollwheel: false,
		draggable: false
	};
    map.setOptions(mapOptions);
}

function enableGMapControl() {
	var mapOptions = {
		disableDoubleClickZoom: false,
		navigationControl: true,
		scaleControl: true,
		scrollwheel: true,
		draggable: true
	};
    map.setOptions(mapOptions);
}

function drawRouteOnTheMap() {
	if(!isFromMarkerSet || !isToMarkerSet) {
		$.error('location and/or destination need(s) to be set');
		return;
	}

	var request = {
		origin: fromMarker.getPosition(),
		destination: toMarker.getPosition(),
		unitSystem: google.maps.UnitSystem.IMPERIAL,
		travelMode: google.maps.DirectionsTravelMode["DRIVING"]
	};

	directionsService.route(request, function(response, status) {
		if(status == google.maps.DirectionsStatus.OK) {
			fromMarker.setVisible(false);
			toMarker.setVisible(false);
			directionsRenderer.setDirections(response);
			map.fitBounds(bounds);
			console.log(directionsRenderer.getDirections().routes[0].legs[0]);
			distance = directionsRenderer.getDirections().routes[0].legs[0].distance.value;
			duration = directionsRenderer.getDirections().routes[0].legs[0].duration.value;
			duration /= 60;
			duration = Math.round(duration);
			refreshMap();
		} else {
			$.error("There was an error in your request. Requeststatus: " + status);
		}
	});
}

function autocompleteInputFieldsUsingGeocoder() {
	geocoder = new google.maps.Geocoder();

	/*
	 * Input field 'from-street'
	 */
	$("#from-street").autocomplete({
		source: function(request, response) {
			geocoder.geocode( {'address': request.term }, function(results, status) {
				response($.map(results, function(item) {
					return {
						label:  item.formatted_address,
						value: item.formatted_address,
						latitude: item.geometry.location.lat(),
						longitude: item.geometry.location.lng()
					}
				}));
			})
		},
		select: function(event, ui) {
			var location = new google.maps.LatLng(ui.item.latitude, ui.item.longitude);
			var departureAddress = ui.item.value.split(',');
			var inEdinburgh = false;
			departureAddress.forEach(function(i) {
				if(i.trim() == "Edinburgh") inEdinburgh = true;
			});

			if(inEdinburgh) {
				fromMarker.setPosition(location);
				fromMarker.setVisible(true);
				map.panTo(location);
				bounds.extend(location);
				isFromMarkerSet = true;

				/*
				 * When the location and destination is set
				 * draw the route on the Map
				 * and set the duration in minute
				 */
				if(isFromMarkerSet && isToMarkerSet)
					drawRouteOnTheMap();
			}
		}
	});

	/*
	 * Input field 'to-street'
	 */
	$("#to-street").autocomplete({
		source: function(request, response) {
			geocoder.geocode( {'address': request.term }, function(results, status) {
				response($.map(results, function(item) {
					return {
						label:  item.formatted_address,
						value: item.formatted_address,
						latitude: item.geometry.location.lat(),
						longitude: item.geometry.location.lng()
					}
				}));
			})
		},
		select: function(event, ui) {
			var location = new google.maps.LatLng(ui.item.latitude, ui.item.longitude);
			var arrivalAddress = ui.item.value.split(',');
			var inEdinburgh = false;
			arrivalAddress.forEach(function(i) {
				if(i.trim() == "Edinburgh") inEdinburgh = true;
			});

			if(inEdinburgh) {
				toMarker.setPosition(location);
				toMarker.setVisible(true);
				map.panTo(location);
				bounds.extend(location);
				isToMarkerSet = true;

				/*
				 * When the location and destination is set
				 * draw the route on the Map
				 * and set the duration in minute
				 */
				if(isFromMarkerSet && isToMarkerSet)
					drawRouteOnTheMap();
			}
		}
	});
}

function selectStreetAddress(addresses) {
	var address = false;
	addresses.forEach(function(item) {
		if(item.types[0] == "street_address") {
			address = item;
		}
	});
	return address;
}

function fillFormFromMarkers(address, isDeparture) {
	console.log(address);
	var streetNb   = address.address_components[0].long_name;
	var streetName = address.address_components[1].long_name;
	var postcode   = address.address_components[5].long_name;

	if(isDeparture) {
		fromAddress = address.formatted_address;
		$("#from-house-nb").val(streetNb);		
		$("#from-street").val(streetName);
		$("#from-postcode").val(postcode);
	} else {
		destinationAddress = address.formatted_address;
		$("#to-house-nb").val(streetNb);
		$("#to-street").val(streetName);
		$("#to-postcode").val(postcode);
	}
}

/*
 * jQuery.ui calendar widget methods
 */
function handleInitAndClickOnCalendar() {
	$('#datepicker').datetimepicker({
		onSelect: function(dateText, inst) {
			onSelectFired = true;
			$('#chosenDate').html(dateText);
		},
		showButtonPanel: false,
	});
	$('#datepicker-container').hide();
	$('#validate-date').click(function() {
		if(!onSelectFired) {
			displayWarningBox("A date and time need to be set<br>You want to get a taxi now? Use the ASAP button");
			return;
		} else {
			isAsap = false;
			hideCalendar();
			departureTime = new Date($('#datepicker').val()).valueOf();
		}
	});
}

function hideCalendar() {
	if(calendarDisplayed) {
		console.log("Hide the calendar");
		$("#datepicker-container").hide(300);
		calendarDisplayed = false;
	}
}

function showCalendar() {
	if(!calendarDisplayed) {
		console.log("Show the calendar");
		$("#datepicker-container").show(200);
		calendarDisplayed = true;
	}
}

function displayErrorBox(errorMessage) {
	$("#error-box").html(errorMessage);
	$("#error-box").show(100);
	setTimeout(function() {
		$("#error-box").hide(100);
	}, 5000);
}

function displayWarningBox(warningMessage) {
	$("#warning-box").html(warningMessage);
	$("#warning-box").show(100);
	setTimeout(function() {
		$("#warning-box").hide(100);
	}, 5000);
}

function checkName() {
	var fullName = $('#full-name').val();

	if(fullName.length > 5) {
		if(fullName.indexOf(' ') > 0) {
			return fullName;
		} else {
			displayErrorBox('Enter a correct full name');
			return false;
		}
	} else {
		displayErrorBox('Your full name is too short');
		return false;
	}
}

function checkMatriculationNumber() {
	var matriculationNumber = $('#mat-nb').val();

	if(matriculationNumber.length == 8 && !isNaN(matriculationNumber)) {
		return matriculationNumber;
	} else {
		displayErrorBox('Enter a correct matriculation number');
		return false;
	}
}

function checkPhoneNumber() {
	var phoneNumber = $('#phone-nb').val();
	if(phoneNumber.length > 9 && phoneNumber.length < 12 && !isNaN(phoneNumber)) {
		return phoneNumber;
	} else {
		displayErrorBox('Enter a correct phone number');
		return false;
	}
}

function displayResultView() {
	$('#loading-logo').show();
	$('#booking-view').hide('blind', 500, function() {
		$('#find-btn').val('Edit booking');
		$('#result-view').show('blind', 500);
	});
	isResultViewDisplayed = true;
}

function displayFormView() {
	isResultViewDisplayed = false;
	$('#result-view').hide('blind', 500, function() {
		$('#find-btn').val('Find a taxi');
		$('#booking-view').show('blind', 500);
	});
}