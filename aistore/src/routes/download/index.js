import { h, Component } from 'preact'
import * as tf from '@tensorflow/tfjs'
// import Loader from '../../components/loader'

import { callBackendAPI } from '../../api'

export default class Download extends Component {

    state = {
        loading: true,
        model: false,
        error: false
    }

    loadModel = async () => {
        const model = await tf.loadLayersModel('../assets/model/model.json')
        this.setState({loading: false, model})
    }
	
	componentDidMount() {
        this.loadModel()
		console.log('Ping API', this.props)
		// callBackendAPI(`download/${this.props.id}`)
		// 	.then(res => this.setState({ 
		// 		image: res.message.image,
		// 		latent: res.message.latent,
        // 		genre: res.message.genre,
        //      error: res.error
		// 	}))
		// 	.catch(err => console.log(err));
	}

	render({}, {loading, error}) {
		return (
			<main class='section'>
				<div class='container content'>
                {loading && <div class={`pageloader ${loading && 'is-active'}`}><span class="title">Loading...</span></div>}
                {error && <h3>Sorry not a valid link!</h3>}  
				</div>
			</main>
		);
	}
}