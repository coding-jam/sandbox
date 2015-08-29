import React from "react";
import _ from "lodash";

var map;
var markers = [];

var draw = function(locations,onMarkerClick) {
	if (map) {

		console.log("Draw ",new Date());

		_.each(markers, function(marker) {
			marker.setMap(null);
		});

		markers = [];

		_.each(locations, function(location) {
			var marker;
			if (location.usersCount > 0) {
				marker = new google.maps.Marker({
					position: new google.maps.LatLng(location.coordinates.lat, location.coordinates.lng),
					map: map,
					animation: google.maps.Animation.DROP,
					icon: "http://chart.apis.google.com/chart?chst=d_map_spin&chld=1|0|FF0000|12|_|" + location.usersCount
				});

				google.maps.event.addListener(marker, 'click', function() {
					onMarkerClick({
						location:location.name,
						language:Store.getLastQuery()
					});
				});

				markers.push(marker);
			}
		});
	}
};

export default class Map extends React.Component {
	componentDidMount() {

		var myLatlng = new google.maps.LatLng(43.5, 12.583761);

		var mapOptions = {
			center: myLatlng,
			draggable: true,
			zoom: this.props.zoom,
			minZoom:4,
			maxZoom:7,
			disableDefaultUI: false,
			panControl:false,
			scaleControl:false,
			rotateControl:false,
			streetViewControl:false,
			zoomControl:true,
			zoomControlOptions:{
				position:google.maps.ControlPosition.RIGHT_BOTTOM,
				style:google.maps.ZoomControlStyle.LARGE
			}
		};

		map = new google.maps.Map(React.findDOMNode(this.refs.chart), mapOptions);

		var changeZoom = () => this.props.changeZoom(map.getZoom());

		google.maps.event.addListener(map, 'zoom_changed', changeZoom);
	}

	render() {

		draw(this.props.locations,this.props.onMarkerClick);

		return (
			<div>
				<div className="Map" ref = "chart">
				</div>
			</div>
		);
	}
}