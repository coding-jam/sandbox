import React from "react";
import * as bootstrap from "react-bootstrap";
import Store from "src/store/UserListStore";
import _ from "lodash";

var Modal = bootstrap.Modal;
var Table = bootstrap.Table;

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

		var items = this.state.users.map(function(user,i) {
			return (
				<tr key={user.id}>
					<td><img width="50" src={user.avatar_url}></img></td>
					<td>{user.name}</td>
					<td>{user.login}</td>
					<td><a href={"mailto://" + user.email}>{user.email}</a></td>
					<td><a target="_blank" href={user.blog}>{user.blog}</a></td>
				</tr>
			);
		},this);

		return items;
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
		            	<Table striped bordered condensed hover>
						    <thead>
						      <tr>
						      	<th></th>
						        <th>Username</th>
						        <th>Nome</th>
						        <th>email</th>
						        <th>Blog</th>
						      </tr>
						    </thead>
						    <tbody>
						    	{rows}
						    </tbody>
						  </Table>
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