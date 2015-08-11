import React from "react";
import * as bootstrap from "react-bootstrap";
import Store from "src/store/UserListStore";
import _ from "lodash";
import UserListRow from "src/components/UserListRow";

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

		return this.state.users.map(function(user,i){
			return (<UserListRow user={user} key={i}></UserListRow>);
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
		          		<div>
			            	<Table striped hover responsive>
								<tbody>
									{rows}
								</tbody>
							</Table>
						</div>
		          </Modal.Body>
		        </Modal>
      		</div>
		);
	}
}