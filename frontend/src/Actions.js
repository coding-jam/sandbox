import _ from "lodash";
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

var userByLocationLoaded = function(users,params){
	return Object.assign({},params,{
		actionType: "userByLocationLoaded",
		users:users
	});
};

var loadRegionList = function() {
	return function(dispatch){
		dispatch(startLoading());
		return Locations.listRegions().then(function(regions){
			dispatch(regionsLoaded(regions));
			return regions;
		});
	};
};

var listUserByLocation = function(params){
	return function(dispatch){
		dispatch(startLoading());
		return users.listUserByLocation(params).then(function(users){
			dispatch(userByLocationLoaded(users,params));
			return users;
		});
	};
};

var loadMarkers = (country,query) => {

	var params = {
		country:country,
		query:query
	};

	return function(dispatch){
		dispatch(startLoading());
		return users.count(params).then(function(markers){
			dispatch(markersLoaded(markers,query,country));
			return markers;
		});
	};
};

var markersLoaded = function(markers,query,country){
	return {
		actionType: "markersLoaded",
		country:country,
		markers:markers,
		query:query
	};
};

var changeZoom = function(zoomValue){
	return {
		actionType: "zoomChange",
		zoom:zoomValue
	};
}

var closeUserDialog = () => {
	return {
		actionType:'closeUserDialog'
	}
};


export default {
	loadRegionList: loadRegionList,
	listUserByLocation: listUserByLocation,
	loadMarkers:loadMarkers,
	changeZoom:changeZoom,
	closeUserDialog:closeUserDialog
};