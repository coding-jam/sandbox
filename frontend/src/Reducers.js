import INITIAL_STATE from "src/model/INITIAL_STATE";

var loadingStart= (state) => {
	return Object.assign({},state,{
		loadingCount:state.loadingCount + 1
	});
};

var loadingEnd = (state) => {
	return Object.assign({},state,{
		loadingCount:state.loadingCount > 0 ? state.loadingCount - 1 : 0
	});
};

var userByLocationLoaded = (state,action) => {
	var toReturn = Object.assign({},state,{
		userList:[...action.users],
		selectedDistrict:action.district,
		showUserModal:true
	});

	return loadingEnd(toReturn);
};

var zoomChange = (state,action) => {
	return Object.assign({},state,{
		zoom:action.zoom
	});
};

var closeUserDialog = (state) => {
	return Object.assign({},state,{
		showUserModal:false,
		userList:[],
		selectedDistrict:"",
	});
}

var markersLoaded = (state,action) => {
	var toReturn = Object.assign({},state,{
		lastQuery:action.query,
		markers:[...action.markers],
		selectedCountry:action.country
	});

	return loadingEnd(toReturn);
};

var reducers = {
	loadingStart:loadingStart,
	loadingEnd:loadingEnd,
	userByLocationLoaded:userByLocationLoaded,
	zoomChange:zoomChange,
	closeUserDialog:closeUserDialog,
	markersLoaded:markersLoaded
};

export default function(state = INITIAL_STATE, action) {

	var reducer = reducers[action.actionType] || ((state) => {return state});

	return reducer(state,action);
}