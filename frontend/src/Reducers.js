import _ from "lodash";

const initialState = {
	loadingCount:0,
	lastQuery:null,
	locations:[],
	usersData:{},
	zoom:6
};

function startLoading(state){
	return Object.assign({},state,{
		loadingCount:state.loadingCount + 1
	});
};

function startSearching(state){
	return Object.assign({},state,startLoading(state),{
		locations:[]
	});
};

function endLoading(state){
	return Object.assign({},state,{
		loadingCount:state.loadingCount > 0 ? state.loadingCount - 1 : 0
	});
};

function userByLanguageLoaded(state,action){
	return Object.assign({},state,{
		lastQuery:action.query,
		locations:[...action.regions]
	});
};

function userByLocationLoaded(state,action){
	return Object.assign({},state,{
		usersData:Object.assign({},_.omit(action,'actionType'))
	});
};

function changeZoom(state,action){
	return Object.assign({},state,{
		zoom:action.zoom
	});
};

export default function(state = initialState, action) {
	switch (action.actionType) {
		case "loadingStart":
			return startLoading(state);
		case "startSearching":
			return startSearching(state);
		case "loadingEnd":
			return endLoading(state);
		case "userByLanguageLoaded":
			return userByLanguageLoaded(state,action);
		case "userByLocationLoaded":
			return userByLocationLoaded(state,action);
		case "zoomChange":
			return changeZoom(state,action);
		default:
			return state;
	};
}