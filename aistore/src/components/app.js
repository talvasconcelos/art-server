import { h, Component } from 'preact';
import { Router } from 'preact-router';

import Header from './header';

// Code-splitting is automated for routes
import Home from '../routes/home';
import Profile from '../routes/profile';

const API = 'http://localhost:3000'

export default class App extends Component {
	
	/** Gets fired when the route changes.
	 *	@param {Object} event		"change" event from [preact-router](http://git.io/preact-router)
	 *	@param {string} event.url	The newly routed URL
	 */
	handleRoute = e => {
		this.currentUrl = e.url;
	};

	callBackendAPI = async () => {
		console.log('Ping API')
		const response = await fetch(`${API}/api/images`)
		const body = await response.json()
		
		if (response.status !== 200) {
		  throw Error(body.message)
		}
		console.log(body)
		return body
	  }

	componentDidMount() {
		this.callBackendAPI()
			.then(res => this.setState({ data: res.message }))
			.catch(err => console.log(err));
	}

	render() {
		return (
			<div id="app">
				<Header />
				<Router onChange={this.handleRoute}>
					<Home path="/" images={this.state.data}/>
					<Profile path="/profile/" user="me" />
					<Profile path="/profile/:user" />
				</Router>
			</div>
		);
	}
}
