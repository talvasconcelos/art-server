import { h, Component } from 'preact'
import { route } from 'preact-router'


import { callBackendAPI, postAPIupdate } from '../../api'

export default class Download extends Component {

    state = {
        error: false,
        checked: false,
        notification: true
    }

    imageDownload = () => {
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')
        const img = document.getElementById('upImg')
        const link = document.createElement('a')
        ctx.drawImage(img, 0, 0, img.naturalWidth, img.naturalHeight)
        link.href = canvas.toDataURL()
        link.setAttribute('download', `upscaled_${this.state.image}`)
        document.body.appendChild(link)
        link.click()
        link.parentNode.removeChild(link)
        this.setState({imageDownloaded: true})
    }

    latentDownload = () => {
        const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(this.state.latent)
        const link = document.createElement('a')
        link.href = dataUri
        link.setAttribute('download', this.state.latentFile)
        document.body.appendChild(link)
        link.click()
        link.parentNode.removeChild(link)
        this.setState({latentDownloaded: true})
    }

    handleCheckbox = () => {
        // console.log(this.state.checked)
        this.setState({checked: !this.state.checked})
    }

    closeNotification = () => {
        this.setState({notification: !this.state.notification})
    }

    deleteImage = () => {
        callBackendAPI(`delete/${this.props.id}`)
            .then(() => this.setState({deleted: true}))
            .then(() => route('/', true))
    }

	componentDidMount() {
		// console.log('Ping API', this.props)
        callBackendAPI(`download/${this.props.id}`)
			.then(res => {
                // console.log(res)
                if(res.error){ 
                    console.log(res)
                    return route('/notfound', true)
                }
                this.setState({
                    image: res.image,
                    latent: JSON.stringify(res.latent),
                    latentFile: res.image.split('.')[0] + '.json',
                    genre: res.genre,
                    url: `../assets/image_sr/${res.downloadID}/`
                })
            })
			.catch(console.error);
	}

	render({}, {image, latent, url, checked, notification}) {
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
                                <a class={`button is-primary`} onClick={this.imageDownload}>Image</a>
                            </p>
                            <p class='control'>
                                <a class={`button is-primary`} onClick={this.latentDownload}>Latent</a>
                            </p>
                        </div>
                    </div>
                    <br/>
                    <div>
                        <h5>Make it exclusive</h5>
                        <div class="field">
                            <p class='control'>
                                <label class="checkbox">
                                    <input type="checkbox" onChange={this.handleCheckbox} />
                                    &nbsp;Delete image
                                </label>
                            </p>
                            {checked &&
                            <p class='control'>
                                {notification && <div class="notification is-danger">
                                    <button class="delete" onClick={this.closeNotification}></button>
                                    Warning! Make sure you downloaded your files. This will delete the image forever! Close this warning to be able to click the button.
                                </div>}
                                <a disabled={notification} class={`button is-danger`} onClick={this.deleteImage}>DELETE</a>
                            </p>}
                        </div>
                    </div>
				</div>
			</main>
		);
	}
}