import { h, Component } from 'preact';
import style from './style';

import { callBackendAPI } from '../../api'

export default class Profile extends Component {
	state = {
		time: Date.now(),
		count: 10
	};

	componentDidMount() {
		console.log('Ping API', this.props.image)
		callBackendAPI(`images/${this.props.image}`)
			.then(res => this.setState({ data: res.message }))
			.catch(err => console.log(err));
	}

	// // update the current time
	// updateTime = () => {
	// 	this.setState({ time: Date.now() });
	// };

	// increment = () => {
	// 	this.setState({ count: this.state.count+1 });
	// };

	// // gets called when this route is navigated to
	// componentDidMount() {
	// 	// start a timer for the clock:
	// 	this.timer = setInterval(this.updateTime, 1000);
	// }

	// // gets called just before navigating away from the route
	// componentWillUnmount() {
	// 	clearInterval(this.timer);
	// }

	// Note: `user` comes from the URL, courtesy of our router
	render({ item }, { time, count }) {
		return (
			<div class={style.profile}>
				<h1>Profile: {item}</h1>
				<p>This is the user profile for a user named { item }.</p>

				<div>Current time: {new Date(time).toLocaleString()}</div>

				<p>
					<button onClick={this.increment}>Click Me</button>
					{' '}
					Clicked {count} times.
				</p>
			</div>
		);
	}
}
