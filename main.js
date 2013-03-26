/*
 * General variables
 */
var mapExpanded = false;
var calendarDisplayed = false;
var map;
var geocoder;

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
	var mapOptions = {
		center: new google.maps.LatLng( 55.973414,-3.188782 ),
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

function autocompleteInputFieldsUsingGeocoder() {
	geocoder = new google.maps.Geocoder();

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
			/*$( "#latitude" ).val(ui.item.latitude);
			$( "#longitude" ).val(ui.item.longitude);*/
			var location = new google.maps.LatLng(ui.item.latitude, ui.item.longitude);
			console.log($("#from-street").val() + ": " + location.toString());
		}
	});
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