import React from "react";

export default class Map extends React.Component{

	componentDidMount() {

		var data = google.visualization.arrayToDataTable([
          ['Country', 'Popularity'],
          ['IT-36',200],
          ['IT-52',300],
          ['IT-57',250]
        ]);

        var options = {
        	region:'IT',
        	resolution:'provinces',
        	displayMode: 'region',
        };

        var chart = new google.visualization.GeoChart(React.findDOMNode(this.refs.chart));

        chart.draw(data, options);
	}

	render() {
	    return (
	    	<div>
				<div ref="chart"></div>
			</div>
	    );
	}
}