const MAP_OPTIONS = {
	center: new google.maps.LatLng(48.79170682091098, 14.517354749999996),
	draggable: true,
	minZoom: 4,
	maxZoom: 7,
	disableDefaultUI: false,
	panControl: false,
	scaleControl: false,
	rotateControl: false,
	streetViewControl: false,
	zoomControl: true,
	zoomControlOptions: {
		position: google.maps.ControlPosition.RIGHT_BOTTOM,
		style: google.maps.ZoomControlStyle.LARGE
	}
};

export default MAP_OPTIONS;