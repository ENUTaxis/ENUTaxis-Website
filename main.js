/*
 * Google Map Functions
 */
function initialize() {
	var mapOptions = {
		center: new google.maps.LatLng( 55.973414,-3.188782 ),
		zoom: 12,
		mapTypeId: google.maps.MapTypeId.ROADMAP
	};
	var map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);
}
google.maps.event.addDomListener(window, 'load', initialize);

/*
 * General JS functions
 */
$(function() {
	handleMenuAndBoxes();
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
	$('a[data-mailto]').click(function(){
		var link = 'mailto:' + $(this).data('mailto');
		window.open(link, 'Mailer');
		return false;
	});
}