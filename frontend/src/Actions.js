import Dispatcher from "src/Dispatcher";
import Locations from "src/model/Locations";
import users from "src/model/Users";

var loadRegionList = function() {
	Dispatcher.dispatch({
		actionType: "loadingStart"
	});

	Locations.listRegions().then(function(regions){
		Dispatcher.dispatch({
			actionType: "loadingEnd"
		});

		Dispatcher.dispatch({
			actionType: "regionsLoaded",
			regions:regions
		});
	})
};

var loadUserInLocationList = function(query) {
	Dispatcher.dispatch({
		actionType: "loadingStart"
	});

	users.listUsersInLocation(query).then(function(regions){
		Dispatcher.dispatch({
			actionType: "loadingEnd"
		});

		Dispatcher.dispatch({
			actionType: "usersInLocationLoaded",
			regions:regions
		});
	})
};

export default {
	loadRegionList: loadRegionList,
	loadUserInLocationList: loadUserInLocationList
};