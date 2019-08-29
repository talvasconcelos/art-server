import { h, Component } from 'preact'
import { Link, route } from 'preact-router'

import { callBackendAPI } from '../../api'

export default class Thankyou extends Component {

    componentDidMount() {
		//console.log('Ping API', this.props)
		callBackendAPI(`images/${this.props.image}`)
			.then(res => this.setState({ 
				image: res.message.image,
				latent: res.message.latent,
				genre: res.message.genre,
				downloadUrl : res.message.downloadID || false
			}))
			.catch(err => console.log(err))
		//https://github.com/GregFrench/super-resolution/tree/master/public/model
    }
    
    render({}, {image, downloadUrl}) {
        return (
            <div class='section'>
                <div class='container'>
				<div class="content">
					<h2>Thank you!</h2>
					<p>Thanks for your support. I'll try to improve the artwork and train on other subjects.</p>
					<figure class='image is-128x128'>
						<img src={`../assets/images/${image}`} alt='' />
					</figure>
					<h4>Network confirmations...</h4>
					<p>
						You're payment was successful. For security reasons we'll just wait for at least 1 network confirmation to send you a download link. If you used Lightning Network it should be instantaneous.
					</p>
					<p>If you entered a valid email, you can close this window and i'll contact you as soon as the payment gets confirmed, else don't leave this page. Hit refresh in a few minutes (depending on the transaction fees) for the download link to be displayed bellow.
					</p>
					<p>
						<Link href={`/download/${downloadUrl}`} class={`button ${!downloadUrl ? 'is-loading' : 'is-primary'}`}>Download</Link>
					</p>
				</div>
                </div>
            </div>
        )
    }
}