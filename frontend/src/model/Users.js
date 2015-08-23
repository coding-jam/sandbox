import jQuery from "jquery";
import _ from "lodash";
import locations from "src/model/Locations";

var listUsersByLanguage = function(searchQuery) {
	if (!searchQuery) {
		return jQuery.get('/api/v1/users/it').then(function(response) {
			var usersInLocations = response.usersInLocations;

			return locations.listRegions().then(function(locations) {

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
		return jQuery.get('/api/v1/languages/it/per-district').then(function(response) {
			var languagesPerRegions = response.languagesPerDistricts;

			return locations.listRegions().then(function(locations) {

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

export default {
	listUsersByLanguage: listUsersByLanguage,
	listUserByLocation: listUserByLocation
};