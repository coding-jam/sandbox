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

		var rows = _.map(this.state.users,function(user){
			return [
				_.omit(user,"languages"),
				_.pick(user,"languages","id")
			];
		});

		rows = _.flatten(rows);

		var renderUserRow = (user) => {

			var renderBlog = (user) => {
				if(!user.blog){
					return "";
				}

				return (
					<div>
						<a target="_blank" href={user.blog}>Blog</a>
					</div>
				);
			};

			return (
				<tr key={user.id}>
					<td className="avatarRow">
						<a href={user.html_url} target="_blank">
							<img className="img-responsive" src={user.avatar_url}>
							</img>
						</a>
					</td>
					<td>
						<strong>{user.login} ({user.name})</strong>
						{renderBlog(user)}
						<div>
							{user.bio}
						</div>
					</td>
				</tr>
			)
		};

		var renderLanguagesRow = (user) => {

			var languages = user.languages.map(function(language,i){
				return (<li key={language}>{language}</li>)
			});

			return (
				<tr key={'l' + user.id}>
					<td colSpan="2">
						<strong>Linguaggi</strong>
						<ul className="list-inline">
						  {languages}
						</ul>
					</td>
				</tr>
			);
		};

		return rows.map(function(row,i) {
			return row.languages ? renderLanguagesRow(row) : renderUserRow(row);
		},this);
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
		            	<Table striped hover responsive>
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