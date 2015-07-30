import React from "react";

export default class Map extends React.Component {
	constructor(props) {
		super(props);
	}

	componentDidMount() {
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