import React from "react";
import Actions from "src/Actions";
import Store from "src/Store";

export default class Map extends React.Component {
	constructor(props) {
	    super(props);
	    this.state = {
	      locations:Store.getLocations()
	    };

	    this.listener = this._listener.bind(this);
	}

	_listener(){
		console.log(Store.getLocations());
		this.setState({
      		locations:Store.getLocations()
	    });
	}

	componentDidMount() {

		Actions.caricaListaRegioni();

		Store.addChangeListener(this.listener);

		var myLatlng = new google.maps.LatLng(42.019159, 12.583761);

		var mapOptions = {
			disableDefaultUI: true,
			center: myLatlng,
			zoom: 6
		};

		var map = new google.maps.Map(React.findDOMNode(this.refs.chart), mapOptions);

		var marker = new google.maps.Marker({
			position: myLatlng,
			map: map
		});
	}

  	componentWillUnmount() {
    	Store.removeChangeListener(this.listener);
  	}

	render() {
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