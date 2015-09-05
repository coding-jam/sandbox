import http from "src/model/Http";
import _ from "lodash";
import q from "q";

var countries = null;
var districts = {};

var getAllDistricts = () => {
	return getCountries().then((countries) => {
		let districts = [];
		let countryPromises = _.map(_.keys(countries),(country)=>{
			return getDistricts(country);
		});

		return q.all(countryPromises).then((results) => {
			return _.flatten(results);
		});
	});
};

var getDistricts = (country) => {
	return http.get('/api/v1/locations/' + country).then(function(response){
		return _.map(response.districts,function(district){
			return {
				country:country,
				name:district.district,
				coordinates: district.details.results[0].geometry.location
			};
		})
	}).catch(() => []);
};

var getCachedCountries = function(){
	var deferred = q.defer();
	deferred.resolve(countries);
	return deferred.promise;
};

var getCountries = function(){
	let loadPromise = () => {
		return http.get('/api/v1/countries').then(function(response){

			countries = {};

			_.each(_.keys(response.continents.europe.countries),function(key){
				var country = response.continents.europe.countries[key];
				countries[key] = {
					name:country.name,
					coordinates: country.geometry.location,
					bounds:country.geometry.viewport
				};
			});

			delete countries.fr;

			return countries;
		});
	};

	return countries ? getCachedCountries() : loadPromise();
};

export default {
	getCountries:getCountries,
	getDistricts:getDistricts,
	getAllDistricts:getAllDistricts
};