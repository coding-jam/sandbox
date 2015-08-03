import React from "react";
import Actions from "src/Actions";
import Store from "src/Store";
import _ from "underscore";

var map;

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

		var myLatlng = new google.maps.LatLng(42.019159, 12.583761);

		var mapOptions = {
			disableDefaultUI: true,
			center: myLatlng,
			zoom: 6
		};

		map = new google.maps.Map(React.findDOMNode(this.refs.chart), mapOptions);
	}

  	componentWillUnmount() {
    	Store.removeChangeListener(this.listener);
  	}

	render() {
		if(map){
			var markers = [];
			_.each(this.state.locations,function(location){
				markers.push(new google.maps.Marker({
					position: new google.maps.LatLng(location.coordinates.lat, location.coordinates.lng),
					map: map
				}));
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