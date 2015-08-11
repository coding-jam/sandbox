import React from "react";
import * as bootstrap from "react-bootstrap";
import Store from "src/store/LoaderStore";

var Modal = bootstrap.Modal;

export default class Loader extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			showModal: false
		};

		this.listener = this._listener.bind(this);
	}

	componentDidMount() {
		Store.addChangeListener(this.listener);
	}

	componentWillUnmount() {
		Store.removeChangeListener(this.listener);
	}

	_listener() {
		this.setState({
			showModal: Store.isLoading()
		});
	}

	render() {

		return ( 
			<div className={'Loader ' + (this.state.showModal ? 'show' : 'hidden')}>		
      		</div>
		);
	}
}