import { h, Component } from 'preact'
import { route } from 'preact-router'


import { callBackendAPI } from '../../api'

export default class Download extends Component {

    state = {
        error: false,
    }

    imageDownload = () => {
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')
        const img = new Image()
        img.src = `${this.state.url}/${this.state.image}`
        img.onload = () => ctx.drawImage(img, 0, 0)
        const link = document.createElement('a')
        link.href = canvas.toDataURL()
        link.setAttribute('download', `upscaled_${this.state.image}`)
        document.body.appendChild(link)
        link.click()
        link.parentNode.removeChild(link)
    }

	componentDidMount() {
		// console.log('Ping API', this.props)
        callBackendAPI(`download/${this.props.id}`)
			.then(res => {
                console.log(res)
                if(res.error){ return route('/notfound', true) }
                this.setState({
                    image: res.image,
                    latent: JSON.stringify(res.latent, null),
                    genre: res.genre,
                    url: `http://sparkpay.pt/sr_img/${res.downloadID}/`
                })
            })
			.catch(console.error);
	}

	render({}, {image, latent, url}) {
		return (
			<main class='section'>
				<div class='container content'>
                    <h2>Upscaled Painting</h2>
                    <figure class='image is-square'>
						<img id='upImg' src={`${url}${image}`} alt='' />
					</figure>
                    <div>
                        <h5>Latent space</h5>
                        <p><pre class='latent'>{latent}</pre></p>
                    </div>
                    <br/>                    
                    <div>
                        <h5>Done</h5>
                        <p>Your image is ready for download. You can either right-click the image and do save image or click the buttons bellow. If you want to make this an exclusive art painting, click the "Exclusive" button bellow. Beware that the painting will no longer be displayed and will be deleted from the database. The only way to reproduce the painting is with the latent space.</p>
                    </div>
                    <br/>
                    <div>
                        <h5>Save your files</h5>
                        <div class="field is-grouped">
                            <p class='control'>
                                <a download={`upscaled_${image}`} class={`button is-primary imageDownload`} onClick={this.imageDownload}>Scale 2x</a>
                            </p>
                        </div>
                    </div>
				</div>
			</main>
		);
	}
}