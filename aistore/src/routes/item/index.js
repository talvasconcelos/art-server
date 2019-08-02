import { h, Component } from 'preact';
import style from './style';

import { callBackendAPI } from '../../api'
import { Latent } from '../../components/latent_viz'

export default class Profile extends Component {
	
	componentDidMount() {
		console.log('Ping API', this.props.image)
		callBackendAPI(`images/${this.props.image}`)
			.then(res => this.setState({ 
				image: res.message.image,
				latent: res.message.latent,
				genre: res.message.genre
			}))
			.catch(err => console.log(err));
	}

	render({}, { image, latent, genre }) {
		return (
			<main>
				<div class="section">
					<div class="container">
						<div class="columns">
							<div class="column">
								<div class='product'>
									<div class='bg' style={{backgroundImage: `url(../assets/images/${image})`}} />
									<figure class='image is-128x128'>
										<img src={`../assets/images/${image}`} alt='' />
									</figure>
								</div>
							</div>
							<div class="column">
								<div class='content is-medium'>
									<h3>{`${genre}`}</h3>
									<p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Non, est?</p>
									<Latent data={latent}/>
									<br/>
									<div class="field is-grouped">
										<p class="control">
											<a class="button is-link">Like</a>
										</p>
										<p class="control">
											<a class="button is-primary">Buy</a>
										</p>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</main>
		);
	}
}
