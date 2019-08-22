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
                    <h3>Thank you for your support!</h3>
                </div>
            </div>
        )
    }
}