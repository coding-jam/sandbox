import React from "react";
import Actions from "src/Actions";
import Store from "src/store/MapStore";
import _ from "lodash";

var map;
var markers = [];

var draw = function(locations) {
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
					Actions.listUserByLocation({
						location:location.name,
						language:Store.getLastQuery()
					});
				});

				markers.push(marker);
			}
		});
	}
};

var checkUsers = function(locations){
	var totalUsers = _.reduce(locations, function(memo, location){ return memo + location.usersCount; }, 0);
	return totalUsers > 0;
};

export default class Map extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			locations: Store.getLocations()
		};

		this.listener = this._listener.bind(this);
	}

	_listener() {
		this.setState({
			locations: Store.getLocations()
		});

		if(this.state.locations.length > 0 && !checkUsers(this.state.locations)){
			swal("Nessun utente corrisponde alla ricerca!");
		}
	}

	componentDidMount() {

		Actions.loadUserByLanguage();
		Store.addChangeListener(this.listener);

		var myLatlng = new google.maps.LatLng(43.5, 12.583761);

		var mapOptions = {
			center: myLatlng,
			draggable: true,
			zoom: 6,
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

		google.maps.event.addListener(map, 'zoom_changed', function() {
			Actions.changeZoom(map.getZoom());
		});
	}

	componentWillUnmount() {
		Store.removeChangeListener(this.listener);
	}

	render() {

		draw(this.state.locations);

		return (
			<div>
				<div className="Map" ref = "chart">
				</div>
			</div>
		);
	}
}