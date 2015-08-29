import Locations from "src/model/Locations";
import users from "src/model/Users";

var startLoading = function(){
	return {
		actionType: "loadingStart"
	};
};

var endLoading = function(){
	return {
		actionType: "loadingEnd"
	};
};

var startSearching = function(){
	return {
		actionType: "startSearching"
	};	
};

var regionsLoaded = function(regions){
	return {
		actionType: "regionsLoaded",
		regions:regions
	};
};

var userByLanguageLoaded = function(regions,query){
	return {
		actionType: "userByLanguageLoaded",
		regions:regions,
		query:query
	};
};

var userByLocationLoaded = function(users,params){
	return Object.assign({},params,{
		actionType: "userByLocationLoaded",
		users:users
	});
};

var loadRegionList = function() {
	return function(dispatch){
		dispatch(startSearching());
		return Locations.listRegions().then(function(regions){
			dispatch(regionsLoaded(regions));
			dispatch(endLoading());
			return regions;
		});
	};
};

var loadUserByLanguage = function(query) {
	return function(dispatch){
		dispatch(startSearching());
		return users.listUsersByLanguage(query).then(function(regions){
			dispatch(userByLanguageLoaded(regions,query));
			dispatch(endLoading());
			return regions;
		});
	};
};

var listUserByLocation = function(params){
	return function(dispatch){
		dispatch(startSearching());
		return users.listUserByLocation(params).then(function(users){
			dispatch(userByLocationLoaded(users,params));
			dispatch(endLoading());
			return users;
		});
	};
};

var changeZoom = function(zoomValue){
	return {
		actionType: "zoomChange",
		zoom:zoomValue
	};
}

export default {
	loadRegionList: loadRegionList,
	loadUserByLanguage: loadUserByLanguage,
	listUserByLocation: listUserByLocation,
	changeZoom:changeZoom
};