import jQuery from "jquery";
import _ from "lodash";
import locations from "src/model/Locations";

var listUsersInLocation = function(searchQuery) {
	if (!searchQuery) {
		return jQuery.get('/api/v1/users').then(function(response) {
			var usersInLocations = response.usersInLocations;

			return locations.listRegions().then(function(locations) {

				_.each(locations, function(location) {
					var currentUserLocation = _.find(usersInLocations, function(userLocation) {
						return userLocation.regionName === location.name;
					});

					location.usersCount = currentUserLocation.usersCount
				});

				return locations;

			});
		});
	}else{
		return jQuery.get('/api/v1/languages/per-locations').then(function(response) {
			var languagesPerRegions = response.languagesPerRegions;

			return locations.listRegions().then(function(locations) {

				_.each(locations, function(location) {

					location.usersCount = 0;

					var currentLanguagesPerRegions = _.find(languagesPerRegions, function(languagePerRegions) {
						return languagePerRegions.regionName === location.name;
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

export default {
	listUsersInLocation: listUsersInLocation
};