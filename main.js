/*
 * General variables
 */
	// Calendar
	var calendarDisplayed = false;

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
	var isToMarkerSet = false;
	var fromMarker;
	var toMarker;
	var bounds;

	// Locations
	var Edinburgh;

/*
 * General JS functions
 */
$(function() {
	/*
	 * Initialize the DatePicker (jQuery.ui library)
	 */
	$("#datepicker").datepicker().hide();

	initializeTheMap();
	handleMenuAndBoxes();
	handleMapButton();
	handleTimeButtons();
	autocompleteInputFieldsUsingGeocoder();
});

function handleMenuAndBoxes() {
	/*
	 * Hide all information boxes
	 */
	$("#about-box").hide();
	$("#contact-box").hide();

	/*
	 * Close the box when the cross is clicked
	 */
	$('.alert .close').click(function(e) {
		console.log(".alert .close fired");
    	$(this).parent().hide(400);
	});

	/*
	 * Home-link hides all boxes
	 */
	$("#home-link").click(function() {
		console.log("home-link fired");
		$("#contact-box").hide(400);
		$("#about-box").hide(400);

		$("#home-link").addClass("actif");
		$("#about-link").removeClass("actif");
		$("#contact-link").removeClass("actif");
		return false;
	});

	/*
	 * About-link displays about-box
	 */
	$("#about-link").click(function() {
		console.log("about-link fired");
		$("#contact-box").hide(400);
		$("#about-box").show(400);

		$("#home-link").removeClass("actif");
		$("#about-link").addClass("actif");
		$("#contact-link").removeClass("actif");
		return false;
	});

	/*
	 * Contact-link displays contact-box
	 */
	$("#contact-link").click(function() {
		console.log("contact-link fired");
		$("#about-box").hide(400);
		$("#contact-box").show(400);

		$("#home-link").removeClass("actif");
		$("#about-link").removeClass("actif");
		$("#contact-link").addClass("actif");
		return false;
	});

	/*
	 * Click on the address mail opens a new window
	 */
	$("a[data-mailto]").click(function(){
		var link = 'mailto:' + $(this).data('mailto');
		window.open(link, 'Mailer');
		return false;
	});
}

function handleTimeButtons() {
	$("#asap").click(function() {
		console.log("asap button fired");
		hideCalendar();
	});
	$("#selectDateTime").click(function() {
		console.log("selectDateTime button fired");
		showCalendar();
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
		if(isFromMarkerSet && isToMarkerSet) drawRouteOnTheMap();
	});

	/*
	 * Listenner when direction is changed
	 */
	google.maps.event.addListener(directionsRenderer, 'directions_changed', function(event) {
		console.log("Direction changed");
		console.log(directionsRenderer.getDirections().routes);
		var fromLocation = directionsRenderer.getDirections().routes[0].legs[0].start_location;
		var toLocation   = directionsRenderer.getDirections().routes[0].legs[0].end_location;
		geocoder.geocode( {'latLng': fromLocation }, function(results, status) {
			if (status == google.maps.GeocoderStatus.OK) {
				var address = selectStreetAddress(results);
				if(address != false)
					fillFormFromMarkers(address, false);
			} else {
				console.log("There was an error in your request. Requeststatus: " + status);
			}
		});
		geocoder.geocode( {'latLng': toLocation }, function(results, status) {
			if (status == google.maps.GeocoderStatus.OK) {
				var address = selectStreetAddress(results);
				if(address != false)
					fillFormFromMarkers(address, false);
			} else {
				console.log("There was an error in your request. Requeststatus: " + status);
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
	if(!isFromMarkerSet || !isToMarkerSet) return;
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
		} else {
			console.log("There was an error in your request. Requeststatus: " + status);
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
				if(isFromMarkerSet && isToMarkerSet) drawRouteOnTheMap();
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
				if(isFromMarkerSet && isToMarkerSet) drawRouteOnTheMap();
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
		$("#from-house-nb").val(streetNb);
		$("#from-street").val(streetName);
		$("#from-postcode").val(postcode);
	} else {
		$("#to-house-nb").val(streetNb);
		$("#to-street").val(streetName);
		$("#to-postcode").val(postcode);
	}
}

/*
 * jQuery.ui calendar widget methods
 */
function hideCalendar() {
	if(calendarDisplayed) {
		console.log("Hide the calendar");
		$("#datepicker").hide(300);
		calendarDisplayed = false;
	}
}

function showCalendar() {
	if(!calendarDisplayed) {
		console.log("Show the calendar");
		$("#datepicker").show(300);
		calendarDisplayed = true;
	}
}

function getDate() {
	console.log("Get the chosen date");
	var currentDate = $("#datepicker").datepicker("getDate");
	console.log(currentDate);
}