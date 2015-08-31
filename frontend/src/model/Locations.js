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

var getCountries = function(){
	return jQuery.get('/api/v1/countries').then(function(response){

		var toReturn = {};

		_.each(_.keys(response.countries),function(key){
			var country = response.countries[key];
			toReturn[key] = {
				name:country.name,
				coordinates: country.geometry.location,
				bounds:country.geometry.bounds
			};
		});

		return toReturn;
	});
};

export default {
	listRegions: listRegions,
	getCountries:getCountries
};