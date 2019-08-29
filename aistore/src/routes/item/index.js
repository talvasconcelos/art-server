import { h, Component } from 'preact'
import { route } from 'preact-router'

import { callBackendAPI } from '../../api'
import { Latent } from '../../components/latent_viz'

export default class Profile extends Component {

	state = {
		ready: false,
		email: null
	}

	validateEmail = (email) => {
		const re = /\S+@\S+\.\S{2,6}/
		return re.test(email)
	}


	handleEmail = (e) => {
		// console.log(e.target.value)
		this.setState({email: e.target.value, ready: this.validateEmail(e.target.value)})
	}

	goBack = () => {
		route(`/?page=${this.props.page}`, true)
	}
	
	componentDidMount() {
		console.log('Ping API')
		callBackendAPI(`images/${this.props.image}`)
			.then(res => this.setState({ 
				image: res.message.image,
				latent: res.message.latent,
				genre: res.message.genre,
				id: res.message._id,
				paid: res.message.paid || false
			}))
			.then(() => {
				const head = document.head
				const ogImg = document.createElement('meta')
				ogImg.setAttribute('property', 'og:image')
				ogImg.setAttribute('content', `https://nudeart.sparkpay.pt/assets/images/${this.state.image}`)
				head.appendChild(ogImg)
			})
			.catch(err => console.log(err));
	}

	render({}, { image, latent, genre, ready, email, id, paid }) {
		console.log(this.state)
		return (
			<main>
				<div class="section container">
					<div style={{marginBottom: '2em'}}>						
						<p onClick={this.goBack} class='button'>
							<span class='icon'>
								<i class='fa fa-chevron-left'></i>
							</span>
							<span>Back</span>
						</p>						
					</div>					
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
								<div class='content'>
									<h3 class='capitalize'>{`${genre}`}</h3>
									<p>Artwork made by artificial intelligence. Generative Adversarial Network (GAN) trained on <a href='https://www.wikiart.org/en/paintings-by-genre/nude-painting-nu?select=featured#!#filterName:featured,viewType:masonry'>Wikiart Nudes</a> and a few hundred NSFW images. After payment you'll get a link to download an AI upscaled PNG version of the painting.</p>
									<p>After payment confirmation the image will be permanently deleted from the database, making it exclusive.</p>
									<p>Price: 10000 satoshis</p>
									<p><small>Piece generated from the gaussian latent space shown bellow.</small></p>
									<Latent data={latent} />
									<br/>
									{paid && <p>Artwork is awaiting payment confirmation.</p>}
									{!paid && <div>
										<div class="field">
											<p class="control">
												<label class="label">Email</label>
												<p class="help">Email needed to receive the download link for your painting after payment confirmation.</p>
												<input class="input" type="email" placeholder="e.g. alexsmith@gmail.com" onKeyUp={this.handleEmail} value={email}/>
												{/* <a class="button is-primary">฿uy</a> */}
											</p>
										</div>
										<form method="POST" action="https://testnet.demo.btcpayserver.org/apps/2v7gwTLEfwyWLUyMxDkBmxPhMTWp/pos">
										{/* <form method="POST" action="https://btcpay01.sparkpay.pt/apps/3LH81CAYBXkicZvGBv7XNvvC5t3D/pos"> */}
											<input type="hidden" name="email" value={email} />
											<input type="hidden" name="orderId" value={id} />
											<input type="hidden" name="notificationUrl" value="https://nudeart.herokuapp.com/api/payments/notify" /> 
											<input type="hidden" name="redirectUrl" value={`https://nudeart.sparkpay.pt/thankyou/${id}`} />
											<button class="button is-primary" type="submit" name="choiceKey" value="ai painting" disabled={!ready}>฿uy</button>
										</form>
									</div>}
								</div>
							</div>
						</div>
					</div>
				</div>
			</main>
		);
	}
}
