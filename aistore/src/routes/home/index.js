import { h, Component } from 'preact'
import { Card } from '../../components/card'
import { Hero } from '../../components/hero'

import { callBackendAPI } from '../../api'

export default class Home extends Component {
	state = {
		images: [],
		page: 1,
		pages: 0
	}

	handleBreadcrum =  (e) => {		
		const x = e.target.id === 'prev' ? -1 : 1
		const pageN = this.state.page + x
		if(pageN == 0 || pageN == this.state.pages + 1) { return }
		const url = `images?pageNo=${pageN}`
		return callBackendAPI(url)
			.then(res => this.setState({ images: res.message,  page: +pageN}))
			.then(() => window.scrollTo(0, 0))
			.catch(err => console.log(err))
	}

	gotoPage = (e) => {
		const pageN = e.target.innerText
		const url = `images?pageNo=${pageN}`
		return callBackendAPI(url)
			.then(res => this.setState({ images: res.message,  page: +pageN}))
			.then(() => window.scrollTo(0, 0))
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
			<main>
				<Hero />
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
							<ul class='pagination-list'>
								{Array(this.state.pages).fill(0).map((_, i) => {
									i += 1
									return (
										<li><a class='pagination-link' onClick={this.gotoPage}>{i}</a></li>
									)
								})}
							</ul>
						</nav>
					</div>
				</div>
			</main>
		)
	}
	
}
