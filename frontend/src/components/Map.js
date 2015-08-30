import React from "react";
import _ from "lodash";
import MAP_OPTIONS from "src/model/MAP_OPTIONS";

var clearMarkers = (markerObjects) => {
	_.each(markerObjects, function(m) {
		m.setMap(null);
	});
}

export default class Map extends React.Component {

	constructor(props) {
		super(props);
		
		this.lastRenderedMarkers = [];
		this.markerObjects = [];
		this.map = null;

		this.renderMap = this._renderMap.bind(this);
	}

	componentDidMount() {

		this.map = new google.maps.Map(React.findDOMNode(this.refs.chart), Object.assign({},MAP_OPTIONS,{zoom:this.props.zoom}));

		var changeZoom = () => this.props.changeZoom(map.getZoom());

		google.maps.event.addListener(this.map, 'zoom_changed', changeZoom);
	}

	_renderMap(){
		if(this.map && this.props.markers !== this.lastRenderedMarkers){

			var that = this;

			clearMarkers(this.markerObjects);

			this.markerObjects = [];

			_.each(this.props.markers, function(m) {
			
				var markerObject;

				if (m.usersCount > 0) {
					markerObject = new google.maps.Marker({
						position: new google.maps.LatLng(m.coordinates.lat, m.coordinates.lng),
						map: that.map,
						animation: google.maps.Animation.DROP,
						icon: "http://chart.apis.google.com/chart?chst=d_map_spin&chld=1|0|FF0000|12|_|" + m.usersCount
					});

					google.maps.event.addListener(markerObject, 'click', function() {
						that.props.markerClick({
							location:m.name
						});
					});

					that.markerObjects.push(markerObject);
				}
			});
			
			this.lastRenderedMarkers = this.props.markers;	
		}
	};

	render() {

		this.renderMap();

		return (
			<div>
				<div className="Map" ref = "chart">
				</div>
			</div>
		);
	}
}