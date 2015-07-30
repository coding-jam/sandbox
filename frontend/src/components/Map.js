import React from "react";
import jQuery from "jquery";
import _ from "underscore";

export default class Map extends React.Component {
	constructor(props) {
		super(props);
	}

	componentDidMount() {
		var mapOptions = {
			center: {
				lat: 42.019159,
				lng: 12.583761
			},
			zoom: 6
		};

		var map = new google.maps.Map(React.findDOMNode(this.refs.chart), mapOptions);
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