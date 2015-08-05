import React from "react";
import Actions from "src/Actions";
import Store from "src/Store";
import _ from "lodash";

var map;
var markers = [];

export default class Map extends React.Component {
	constructor(props) {
	    super(props);
	    this.state = {
	      locations:Store.getLocations()
	    };

	    this.listener = this._listener.bind(this);
	}

	_listener(){
		this.setState({
      		locations:Store.getLocations()
	    });
	}

	componentDidMount() {

		Actions.loadUserInLocationList();
		Store.addChangeListener(this.listener);

		var myLatlng = new google.maps.LatLng(43.5, 12.583761);

		var mapOptions = {
			disableDefaultUI: true,
			center: myLatlng,
			draggable:true,
			zoom: 6
		};

		map = new google.maps.Map(React.findDOMNode(this.refs.chart), mapOptions);
	}

  	componentWillUnmount() {
    	Store.removeChangeListener(this.listener);
  	}

	render() {
		if(map){

			_.each(markers,function(marker){
				marker.setMap(null);
			});

			markers = [];

			_.each(this.state.locations,function(location){
				if(location.usersCount > 0){
					markers.push(new google.maps.Marker({
						position: new google.maps.LatLng(location.coordinates.lat, location.coordinates.lng),
						map: map,
						animation: google.maps.Animation.DROP,
						icon:"http://chart.apis.google.com/chart?chst=d_map_spin&chld=1|0|FF0000|12|_|" + location.usersCount
					}));	
				}
			});	
		}

		return (
			<div>
				<div 
					className="Map"
					ref="chart">
				</div>
			</div>
		);
	}
}