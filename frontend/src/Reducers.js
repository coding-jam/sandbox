import _ from "lodash";

const initialState = {
	loadingCount:0,
	lastQuery:null,
	locations:[],
	usersData:{},
	showUserModal:false,
	zoom:6
};

function startLoading(state){
	return Object.assign({},state,{
		loadingCount:state.loadingCount + 1
	});
};

function endLoading(state){
	return Object.assign({},state,{
		loadingCount:state.loadingCount > 0 ? state.loadingCount - 1 : 0
	});
};

function userByLanguageLoaded(state,action){
	var toReturn = Object.assign({},state,{
		lastQuery:action.query,
		locations:[...action.regions]
	});

	return endLoading(toReturn);
};

function userByLocationLoaded(state,action){
	var toReturn = Object.assign({},state,{
		usersData:Object.assign({},_.omit(action,'actionType')),
		showUserModal:true
	});

	return endLoading(toReturn);
};

function changeZoom(state,action){
	return Object.assign({},state,{
		zoom:action.zoom
	});
};

function closeUserDialog(state){
	return Object.assign({},state,{
		showUserModal:false
	});	
}

export default function(state = initialState, action) {
	switch (action.actionType) {
		case "loadingStart":
			return startLoading(state);
		case "loadingEnd":
			return endLoading(state);
		case "userByLanguageLoaded":
			return userByLanguageLoaded(state,action);
		case "userByLocationLoaded":
			return userByLocationLoaded(state,action);
		case "zoomChange":
			return changeZoom(state,action);
		case "closeUserDialog":
			return closeUserDialog(state,action);
		default:
			return state;
	};
}