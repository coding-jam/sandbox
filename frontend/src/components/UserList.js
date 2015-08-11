import React from "react";
import * as bootstrap from "react-bootstrap";
import Store from "src/store/UserListStore";
import _ from "lodash";
import UserListRow from "src/components/UserListRow";

var Modal = bootstrap.Modal;

export default class UserList extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			showModal: false
		};

		this.close = this._close.bind(this);
		this.listener = this._listener.bind(this);
		this.extendState = this._extendState.bind(this);
		this.renderRows = this._renderRows.bind(this);
	}

	componentDidMount() {
		Store.addChangeListener(this.listener);
	}

	componentWillUnmount() {
		Store.removeChangeListener(this.listener);
	}

	_extendState(data){
		this.setState(_.extend(this.state, data));
	}

	_listener() {
		var data = _.extend(_.clone(Store.getData()),{showModal:true});
		this.extendState(data);
	}

	_close(){
		this.extendState({showModal:false});
	};

	_renderRows(){

		if(!this.state.users){
			return null;
		}

		var splittedUsers = _.chunk(this.state.users, 2);

		return splittedUsers.map(function(userPair,i){
			return (<UserListRow userPair={userPair} key={i} even={i % 2 === 0}></UserListRow>);
		});
	}

	render() {

		var rows = this.renderRows();

		return ( 
			<div>
				<Modal bsSize='large' show={this.state.showModal} onHide={this.close}>
		          <Modal.Header closeButton>
		            	<Modal.Title>{this.state.location}</Modal.Title>
		          </Modal.Header>
		          <Modal.Body>
		          		<div className="container-fluid NoPadding">
			            	{rows}
						</div>
		          </Modal.Body>
		        </Modal>
      		</div>
		);
	}
}