import jQuery from "jquery";
import _ from "lodash";
import q from "q";

var countries = null;
var districts = {};

var getDistricts = (country) => {
	return jQuery.get('/api/v1/locations/' + country).then(function(response){
		return _.map(response.districts,function(district){
			return {
				name:district.district,
				coordinates: district.details.results[0].geometry.location
			};
		})
	});
};

var getCachedCountries = function(){
	var deferred = q.defer();
	deferred.resolve(countries);
	return deferred.promise;
};

var getCountries = function(){
	let loadPromise = jQuery.get('/api/v1/countries').then(function(response){

		countries = {};

		_.each(_.keys(response.continents.europe.countries),function(key){
			var country = response.continents.europe.countries[key];
			countries[key] = {
				name:country.name,
				coordinates: country.geometry.location,
				bounds:country.geometry.viewport
			};
		});

		return countries;
	});

	return countries ? getCachedCountries() : loadPromise;
};

export default {
	getCountries:getCountries,
	getDistricts:getDistricts
};