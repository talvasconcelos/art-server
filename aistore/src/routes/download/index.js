import { h, Component } from 'preact'
import * as tf from '@tensorflow/tfjs'

tf.enableProdMode()
// import Loader from '../../components/loader'

import { callBackendAPI } from '../../api'

let startTime, endTime

function start() {
    startTime = new Date();
};

function end() {
    endTime = new Date();
    var timeDiff = endTime - startTime; //in ms
    // strip the ms
    timeDiff /= 1000;

    // get seconds 
    var seconds = Math.round(timeDiff);
    console.log(seconds + " seconds");
}

export default class Download extends Component {

    state = {
        loading: true,
        working: false,
        model: false,
        error: false,
        cpu: true,
        inference: null
    }

    useCpu = async () => {
        const cpu = this.state.cpu
        await tf.setBackend(`${!cpu ? 'cpu' : 'webgl'}`)
        await this.setState({cpu: !this.state.cpu, backend: tf.getBackend()})
    }

    loadModel = async () => {
        await tf.ready()
        const model = await tf.loadLayersModel('../assets/model/model.json')
        console.log(tf.memory())
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
        const canvas = document.createElement('canvas')
        document.getElementById('upscale').appendChild(canvas)
        await tf.browser.toPixels(src, canvas)
        tf.dispose(src)
    }

    warmUp = async (model, zeros) => {
        const result = await model.predict(zeros)
        result.print()
        result.dispose()
        return
    }

    startInference = async () => {
        start()
        const model = this.state.model
        let tensor
        if(!this.state.inference){
            const img = await this.getImage(`../assets/images/${this.state.image}`)            
            tensor = await tf.tidy(() => {
                return tf.browser.fromPixels(img)
                    .resizeNearestNeighbor([32, 32]) //testing only
                    .toFloat()
                    .div(tf.scalar(255))
                    .expandDims()
            })
            await this.warmUp(model, tf.zerosLike(tensor).resizeBilinear([16, 16]))
        } else {
            tensor = this.state.inference
            tensor.print()
        }
        console.log('Start inference.', tf.memory())
        const inf2x = await tf.tidy(() => model.predict(tensor))
        await this.setState({inference: inf2x})
        console.log(tf.memory())
        const image = await tf.tidy( () => {
            return inf2x
                .clipByValue(0, 1)
                .mul(tf.scalar(255))
                .round()
                .toInt()
                .squeeze()
        })
        const [imgW, imgH, imgC] = image.shape
        await this.drawImage(image.resizeBilinear([imgW*2, imgH*2]))
        // console.log(this.state)
        this.setState({working: !this.state.working, result: true, imgW, imgH})
        end()
    }

    start = async () => {
        await this.setState({working: !this.state.working})
        await tf.nextFrame()
        const time = await tf.time(() => this.startInference())
        console.log(time)
    }
	
	componentDidMount() {
        tf.setBackend(`${this.state.cpu ? 'cpu' : 'webgl'}`)
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
                        <h5>Read carefully</h5>
                        <p>The upscaling is done in your browser, please make sure you have at least <strong>12GB of GPU memory</strong>. If you're not sure about this choose to do the scaling with CPU but, it will take some time... As a reference, on my desktop (i7) it took around 40 minutes to scale from the original 128x128 picture to 512x512.</p>
                        <p>If you want to make the artwork exclusive, don't forget to hit the make it exclusive after you downloaded your painting. Make sure you only delete, after you downloaded the files. After that the artwork won't be available ever again. Unless you have your latent data stored. Then you can contact me to generate it again.</p>
                    </div>
                    <br/>
                    <div>
                        <h5>Now let's do some magic...</h5>
                        <div class="field is-grouped">
                            <div class="control">
                                <label class="checkbox">
                                    <input type="checkbox" name="cpu" onChange={this.useCpu} checked={this.state.cpu}/>
                                    &nbsp;Use CPU
                                </label>
                            </div>
                            <p className='control'>
                                <a class={`button is-primary ${this.state.working && 'is-loading'}`} onClick={this.start} >Scale 2x</a>
                            </p>
                        </div>
                    </div>
                    {this.state.result && 
                    <div>
                        <h5>Done</h5>
                        <p>Your image is ready for download. Current dimensions are {`${this.state.imgW}x${this.state.imgH}`}. You can hit the scale button again to go up to {`${this.state.imgW * 2}x${this.state.imgH * 2}`}. I must warn you that unless you have a powerfull GPU don't go above 512x512.</p>
                    </div>
                    }
                    <div id='upscale'></div>
				</div>
			</main>
		);
	}
}