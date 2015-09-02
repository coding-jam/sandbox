import jQuery from "jquery";
import _ from "lodash";
import locations from "src/model/Locations";
import languages from "src/model/Languages";

import q from "q";

var countByCountry = function(country,searchQuery) {
	if (!searchQuery) {
		return jQuery.get('/api/v1/users/' + country).then(function(response) {
			var usersInLocations = response.usersInLocations;

			return locations.getDistricts(country).then(function(locations) {

				_.each(locations, function(location) {
					var currentUserLocation = _.find(usersInLocations, function(userLocation) {
						return userLocation.districtName === location.name;
					});

					location.usersCount = currentUserLocation.usersCount
				});

				return locations;

			});
		});
	}else{
		return jQuery.get('/api/v1/languages/' + country + '/per-district').then(function(response) {
			var languagesPerRegions = response.languagesPerDistricts;

			return locations.getDistricts(country).then(function(locations) {

				_.each(locations, function(location) {

					location.usersCount = 0;

					var currentLanguagesPerRegions = _.find(languagesPerRegions, function(languagePerRegions) {
						return languagePerRegions.districtName === location.name;
					});

					if(currentLanguagesPerRegions){
						var currentLanguage = _.find(currentLanguagesPerRegions.languages,function(language){
							return language.language.toUpperCase() === searchQuery.toUpperCase();
						});

						if(currentLanguage){
							location.usersCount = currentLanguage.usersPerLanguage;	
						}
						
					}
					
				});

				return locations;

			});
		});
	}

};

var listUserByLocation = function(params){
	return jQuery.get('/api/v1/users/it/' + params.location.toLowerCase()).then(function(response) {
			var users = response.items;

			if(params.language){
				users = _.filter(users,function(user){

					return user.languages && _.find(user.languages,function(language){
						return language.toUpperCase() === params.language.toUpperCase();
					});
				});
			}

			return users;
		});
};

var countEurope = function(query){
	let currentUserPromise;
	if (query) {
		currentUserPromise = languages.getLanguagesPerCountries().then((languagesPerCountries) => {
			return _.map(languagesPerCountries, function(countryData) {
				let toReturn = _.pick(countryData, 'countryName', 'countryKey');
				
				let language = _.find(countryData.languages, function(languageInfo) {
					return languageInfo.language.toUpperCase() === query.toUpperCase();
				});

				toReturn.usersCount = language ? language.usersPerLanguage : 0;

				return toReturn;
			});
		});
	} else {
		currentUserPromise = jQuery.get('api/v1/users').then(function(response) {
			return response.usersInCounties;
		});
	}

	return q.all([currentUserPromise,locations.getCountries()]).then((results) => {
		var [users,countries] = results;

		_.each(users,function(user){
			user.coordinates = countries[user.countryKey].coordinates;
		});

		return users;
	});
}

var count = function(params){
	return params.country ? countByCountry(params.country,params.query) : countEurope(params.query);
};

export default {
	listUserByLocation: listUserByLocation,
	count:count
};