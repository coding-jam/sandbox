import React from "react";
import jQuery from "jquery";
import _ from "underscore";

export default class Map extends React.Component{

	componentDidMount() {

		var chart = new google.visualization.GeoChart(React.findDOMNode(this.refs.chart));
		
		jQuery.ajax({
			url: "http://www.json-generator.com/api/json/get/bZQWyRIhQi?indent=2",
		}).then(function(results) {
			var rawData = [
				['Country', 'Popularity']
			];
			_.each(results, function(result) {
				rawData.push([result.region, result.value]);
			});

			var options = {
				region: 'IT',
				resolution: 'provinces',
				displayMode: 'region',
			};

			chart.draw(google.visualization.arrayToDataTable(rawData), options);

		});

	}

	render() {
	    return (
	    	<div>
				<div ref="chart"></div>
			</div>
	    );
	}
}