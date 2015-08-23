import jQuery from "jquery";
import _ from "lodash";

var listRegions = function() {
	return jQuery.get('/api/v1/locations/it').then(function(response){
		return _.map(response.districts,function(region){
			return {
				name:region.district,
				coordinates: region.details.results[0].geometry.location
			};
		})
	});
};

export default {
	listRegions: listRegions
};