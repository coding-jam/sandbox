import React from "react";
import Actions from "src/Actions";

export default class SearchForm extends React.Component {
	constructor(props) {
		super(props);
		this.search = this._search.bind(this);
		this.onKeypress = this._onKeypress.bind(this);
	}

	_search(){
		Actions.loadUserByLanguage(React.findDOMNode(this.refs.querySearch).value);
	};

	_onKeypress(e){
		if (e.charCode === 13) {
			this.search();
        	return false;
    	}
	};

	render() {
		return (
			<nav className="navbar navbar-default navbar-fixed-top">
		      <div className="container">
		        <div className="navbar-header">
		          <a className="navbar-brand" href="#">Git-Map</a>
		        </div>
		        <form className="navbar-form navbar-right" role="search">
			        <div className="form-group">
			          <input 
			          	ref="querySearch" 
			          	type="text" 
			          	className="form-control" 
			          	onKeyPress={this.onKeypress}
			          	placeholder="Cerca per linguaggio..."></input>
			        </div>
			        <button 
			        	type="button"
			        	onClick={this.search}
			        	className="btn btn-default">Cerca</button>
		      	</form>
		      </div>
		    </nav>
		);
	}
}