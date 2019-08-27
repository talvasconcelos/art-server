import { h, Component } from 'preact'
import { Router } from 'preact-router'

import Header from './header'

// Code-splitting is automated for routes
import Home from '../routes/home'
import Item from '../routes/item'
import Thankyou from '../routes/thankyou'
import Download from '../routes/download'

export default class App extends Component {
	
	/** Gets fired when the route changes.
	 *	@param {Object} event		"change" event from [preact-router](http://git.io/preact-router)
	 *	@param {string} event.url	The newly routed URL
	 */
	handleRoute = e => {
		this.currentUrl = e.url;
	}

	render() {
		return (
			<div id="app">
				<Header />
				<Router onChange={this.handleRoute}>
					<Home path="/" />
					<Item path="/item/:image" />
					<Thankyou path="/thankyou/:image" />
					<Download path='/download/:id' />
				</Router>
			</div>
		);
	}
}
