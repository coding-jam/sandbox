import jQuery from "jquery";
import _ from "underscore";
import locations from "src/model/Locations";

var listUsersInLocation = function() {
	
	return jQuery.get('/api/v1/users').then(function(response){
		var usersInLocations = response.usersInLocations;
		
		return locations.listRegions().then(function(locations){
			
			_.each(locations,function(location){
				var currentUserLocation = _.find(usersInLocations,function(userLocation){
					return userLocation.regionName === location.name;
				});

				location.usersCount = currentUserLocation.usersCount
			});

			return locations;
			
		});
	});
};

export default {
	listUsersInLocation: listUsersInLocation
};