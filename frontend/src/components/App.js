import React from "react";
import UserList from "src/components/UserList";
import SearchForm from "src/components/SearchForm";
import Loader from "src/components/Loader";
import Map from 'src/components/Map';
import { connect } from 'react-redux';
import Actions from "src/Actions";

class App extends React.Component{

	constructor(props) {
		super(props);
		this.search = this._search.bind(this);
		this.changeZoom = this._changeZoom.bind(this);
		this.markerClick = this._markerClick.bind(this);
		this.closeModal = this._closeModal.bind(this);
	}

	_search(value){
		return this.props.dispatch(Actions.loadMarkers(value));
	}

	_changeZoom(value){
		this.props.dispatch(Actions.changeZoom(value));
	}

	_markerClick(location){
		this.props.dispatch(Actions.listUserByLocation(location));
	}

	_closeModal(){
		this.props.dispatch(Actions.closeUserDialog());
	}

	componentDidMount(){
		this.props.dispatch(Actions.loadMarkers());
	}

	render() {
	    return (
	    	<div>
	    		<SearchForm 
	    			search={this.search}/>
				<Loader 
					show={this.props.loadingCount > 0}/>
				<Map
					markerClick={this.markerClick} 
					changeZoom={this.changeZoom}
					zoom={this.props.zoom} 
					markers={this.props.markers}/>
				<UserList 
					initialQuery={this.props.lastQuery}
					closeModal={this.closeModal}
					showModal={this.props.showUserModal}
					users={this.props.userList}
					location={this.props.currentLocation}/>
			</div>
	    );
	}
};

var select = state => state;

export default connect(select)(App);