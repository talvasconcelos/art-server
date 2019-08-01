import { h, Component } from 'preact';
import { Card } from '../../components/card'

import { callBackendAPI } from '../../api'

export default class Home extends Component {
	state = {
		images: [],
		page: 1,
		pages: 0
	}

	handleBreadcrum (e) {
		// if(this.state.page === 1) { return }
		const x = e.target.id === 'prev' ? -1 : 1
		const pageN = this.state.page + x
		const url = `images?pageNo=${pageN}`
		console.log(x, pageN, url)
		return callBackendAPI(url)
			.then(res => this.setState({ images: res.message,  page: pageN}))
			.catch(err => console.log(err))
	}

	getData(url) {
		return callBackendAPI(url)
			.then(res => this.setState({ images: res.message,  pages: res.pages}))
			.catch(err => console.log(err))
	}

	componentDidMount() {
		return this.getData('images')
	}

	render({}, {images}) {
		return (
			<div class='section'>
				<div class='container'>
					<div class='grid'>
						{images.map((img, idx) => {
							return (
								<div class='card-wrapper'>
									<Card image={img} key={idx}/>
								</div>
							)
						})}

					</div>
					<nav class="pagination is-centered" role="navigation" aria-label="pagination">
						<a class="pagination-previous" id='prev' onClick={this.handleBreadcrum}>Previous</a>
						<a class="pagination-next" id='next' onClick={this.handleBreadcrum}>Next page</a>
					</nav>
				</div>
			</div>
		)
	}
	
}
