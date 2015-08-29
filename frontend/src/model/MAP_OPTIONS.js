const MAP_OPTIONS = {
	center: new google.maps.LatLng(43.5, 12.583761),
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