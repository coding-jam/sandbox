import React from "react";
import * as bootstrap from "react-bootstrap";
import Store from "src/store/LoaderStore";

var Modal = bootstrap.Modal;

export default class UserList extends React.Component {
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
			<div>
				<Modal show={this.state.showModal}>
		          <h1>Please wait</h1>
		        </Modal>
      		</div>
		);
	}
}