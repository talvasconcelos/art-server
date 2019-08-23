import { h, Component } from 'preact'

import { callBackendAPI } from '../../api'

export default class Thankyou extends Component {

    componentDidMount() {
		console.log('Ping API', this.props)
		// callBackendAPI(`images/${this.props.image}`)
		// 	.then(res => this.setState({ 
		// 		image: res.message.image,
		// 		latent: res.message.latent,
		// 		genre: res.message.genre
		// 	}))
		// 	.then(() => {
		// 		const head = document.head
		// 		const ogImg = document.createElement('meta')
		// 		ogImg.setAttribute('property', 'og:image')
		// 		ogImg.setAttribute('content', `https://nudeart.sparkpay.pt/images/${this.state.image}`)
		// 		head.appendChild(ogImg)
		// 	})
		// 	.catch(err => console.log(err));
    }
    
    render({}, {}) {
        return (
            <div class='section'>
                <div class='container'>
				<div class="content">
					<h1>Thank you!</h1>
					<p>Thanks for your support. I'll try to improve the artwork and train on other subjects.</p>
					<h2>I'm working on your painting...</h2>
					<p>
						You're payment was successful. For security reasons we'll just wait for at least 1 network confirmation to send you a download link. If you used Lightning Network it should be instantaneous.
					</p>
					<p>If you entered a valid email, i'll contact you as soon as the payment gets confirmed, else don't leave this page. Hit refresh in a few minutes (depending on the transaction fees) for the download link to be displayed bellow.</p>
				</div>
                </div>
            </div>
        )
    }
}