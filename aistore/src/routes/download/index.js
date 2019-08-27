import { h, Component } from 'preact'
import * as tf from '@tensorflow/tfjs'
// import Loader from '../../components/loader'

import { callBackendAPI } from '../../api'
import { ready } from '@tensorflow/tfjs';

export default class Download extends Component {

    state = {
        loading: true,
        inference: false,
        model: false,
        error: false
    }

    loadModel = async () => {
        await ready()
        const model = await tf.loadLayersModel('../assets/model/model.json')
        this.setState({loading: false, model: model, backend: tf.getBackend()})
    }

    getImage = async (src) => {
        return new Promise((resolve, reject) => {
            let img = new Image()
            img.onload = () => resolve(img)
            img.onerror = reject
            img.src = src
        })
    }

    drawImage = async (src) => {
        const canvas = document.getElementById('upscale')
        // canvas.width = 128
        // canvas.height = 128
        //ctx = canvas.getContext('2d')
        await tf.browser.toPixels(src, canvas)
    }

    startInference = async () => {        
        const model = this.state.model
        const img = await this.getImage(`../assets/images/${this.state.image}`)            
        const tensor = await tf.browser.fromPixels(img)
            .resizeBilinear([32, 32])
            // .toFloat()
            .div(tf.scalar(255))
            // .expandDims()
        tensor.print()
        // await this.drawImage(tensor)
        const inference = await model.predict(tensor.expandDims())
            //.toFloat().div(tf.scalar(127)).sub(tf.scalar(1))
            .clipByValue(0, 1)
            .mul(tf.scalar(255))
            .toInt()
            .clipByValue(0, 255)
            .reshape([64, 64, 3])
            // .clipByValue(0, 255)
            // .mul(tf.scalar(255))
        inference.print()
        // this.setState({inferenceDone: true})
        // inference.print()
        await tf.nextFrame()
        this.drawImage(inference)        
        this.setState({inference: !this.state.inference})
        
    }

    start = () => {
        this.setState({inference: !this.state.inference})
        return tf.tidy(() => this.startInference())
    }
	
	componentDidMount() {
        this.loadModel()
		console.log('Ping API', this.props)
		callBackendAPI(`download/${this.props.id}`)
			.then(res => this.setState({ 
				image: res.message.image,
				latent: res.message.latent,
        		genre: res.message.genre,
                error: res.error
            }))
            // .then(() => this.startInference())
			.catch(err => console.log(err));
	}

	render({}, {loading, error, image}) {
		return (
			<main class='section'>
				<div class='container content'>
                    {loading && <div class={`pageloader ${loading && 'is-active'}`}><span class="title">Loading...</span></div>}
                    {error && <h3>Sorry not a valid link!</h3>}
                    <h2>Original Painting</h2>
                    <figure class='image is-128x128'>
						<img id='origImg' src={`../assets/images/${image}`} alt='' />
					</figure>
                    <div>
                        <p>Now let's do some magic...</p>
                        <a class={`button is-primary ${this.state.inference && 'is-loading'}`} onClick={this.start} >Scale 2x</a>
                    </div>
                    <div>
                        <h2>Done</h2>
                        <p>{this.state.backend}</p>
                        <canvas id='upscale'></canvas>
                    </div>
				</div>
			</main>
		);
	}
}