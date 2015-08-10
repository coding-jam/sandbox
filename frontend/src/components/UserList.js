import React from "react";
import * as bootstrap from "react-bootstrap";
import Store from "src/store/UserListStore";

var Modal = bootstrap.Modal;

export default class UserList extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			showModal: false
		};

		this.close = this._close.bind(this);
		this.open = this._open.bind(this);
		this.listener = this._listener.bind(this);
	}

	componentDidMount() {
		Store.addChangeListener(this.listener);
	}

	componentWillUnmount() {
		Store.removeChangeListener(this.listener);
	}

	_listener() {
		this.open();
	}

	_close(){
		this.setState({
			showModal:false
		});
	};

	_open(){
		this.setState({
			showModal:true
		});
	};

	render() {
		return ( 
			<div>
				<Modal show={this.state.showModal} onHide={this.close}>
		          <Modal.Header closeButton>
		            <Modal.Title>Titolo</Modal.Title>
		          </Modal.Header>
		          <Modal.Body>
		            	Testo
		          </Modal.Body>
		          <Modal.Footer>
		          	<button 
			        	type="button"
			        	onClick={this.close}
			        	className="btn btn-default">Chiudi</button>
		          </Modal.Footer>
				</Modal>
      		</div>
		);
	}
}