import React from "react";
import _ from "lodash";
import MAP_OPTIONS from "src/MAP_OPTIONS";

var map;
var markers = [];

var draw = function(locations,onMarkerClick) {
	if (map) {

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
						location:location.name
					});
				});

				markers.push(marker);
			}
		});
	}
};

export default class Map extends React.Component {

	constructor(props) {
		super(props);
		this.lastRenderedLocations = null;
	}

	componentDidMount() {

		map = new google.maps.Map(React.findDOMNode(this.refs.chart), Object.assign({},MAP_OPTIONS,{zoom:this.props.zoom}));

		var changeZoom = () => this.props.changeZoom(map.getZoom());

		google.maps.event.addListener(map, 'zoom_changed', changeZoom);
	}

	render() {

		if(this.props.locations !== this.lastRenderedLocations){
			draw(this.props.locations,this.props.markerClick);
			this.lastRenderedLocations = this.props.locations;	
		}

		return (
			<div>
				<div className="Map" ref = "chart">
				</div>
			</div>
		);
	}
}