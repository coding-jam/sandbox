import Dispatcher from "src/Dispatcher";
import Locations from "src/model/Locations";
import users from "src/model/Users";
import _ from "lodash";

var loadRegionList = function() {
	Dispatcher.dispatch({
		actionType: "loadingStart"
	});

	Locations.listRegions().then(function(regions){
		Dispatcher.dispatch({
			actionType: "regionsLoaded",
			regions:regions
		});

		Dispatcher.dispatch({
			actionType: "loadingEnd"
		});

	})
};

var loadUserByLanguage = function(query) {
	Dispatcher.dispatch({
		actionType: "loadingStart"
	});

	users.listUsersByLanguage(query).then(function(regions){
		Dispatcher.dispatch({
			actionType: "userByLanguageLoaded",
			regions:regions,
			query:query
		});

		Dispatcher.dispatch({
			actionType: "loadingEnd"
		});

	});
};

var listUserByLocation = function(params){
	Dispatcher.dispatch({
		actionType: "loadingStart"
	});

	users.listUserByLocation(params).then(function(users){
		Dispatcher.dispatch({
			actionType: "loadingEnd"
		});

		var action = _.extend(params,{
			actionType: "userByLocationLoaded",
			users:users
		});

		Dispatcher.dispatch(action);
	});
};

var changeZoom = function(zoomValue){
	Dispatcher.dispatch({
		actionType: "zoomChange",
		zoom:zoomValue
	});
}

export default {
	loadRegionList: loadRegionList,
	loadUserByLanguage: loadUserByLanguage,
	listUserByLocation: listUserByLocation,
	changeZoom:changeZoom
};