import React from "react";
import jQuery from "jquery";
import _ from "underscore";
import HighmapsLib from "highslide-software/highmaps-release/highmaps";
import mapData from "src/map/italy";

export default class Map extends React.Component {
	constructor(props) {
	    super(props);
	    
	    this.draw = this._draw.bind(this);
	}

	_draw(data) {

		jQuery(React.findDOMNode(this.refs.chart)).highcharts('Map', {
			chart:{margin: 0},
			mapNavigation: {
				enabled: true,
				buttonOptions: {
					verticalAlign: 'bottom'
				}
			},

			title : {
         	   text : ''
        	},

			colorAxis: {
	            min: 0
	        },

			series: [{
				data: data,
				mapData: mapData,
				joinBy: 'hc-key',
				states: {
					hover: {
						color: '#BADA55'
					}
				}
			}]
		});
	}

	componentDidMount() {

		var self = this;

		jQuery.ajax({
			url: "http://www.json-generator.com/api/json/get/cgtKuLyKdK?indent=2",
		}).then(function(results) {
			self.draw(results);
		});

	}

	render() {
		return (<div><div ref="chart"></div></div>);
	}
}