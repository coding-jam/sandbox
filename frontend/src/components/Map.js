import React from "react";

export default class Map extends React.Component{

	componentDidMount() {

		var data = google.visualization.arrayToDataTable([
          ['Country', 'Popularity'],
          ['Germany', 200],
          ['United States', 300],
          ['Brazil', 400],
          ['Canada', 500],
          ['France', 600],
          ['RU', 700]
        ]);

        var options = {};

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