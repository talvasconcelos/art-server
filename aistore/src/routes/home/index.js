import { h, Component } from 'preact'
import { Card } from '../../components/card'
import { Hero } from '../../components/hero'
import { Share } from '../../components/share'

import { callBackendAPI } from '../../api'

export default class Home extends Component {
	state = {
		images: [],
		page: 1,
		share: false,
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

	gotoPage = (e, breadcrum = true) => {
		const pageN = breadcrum ? e.target.innerText : e
		const url = `images?pageNo=${pageN}`
		return callBackendAPI(url)
			.then(res => this.setState({ 
				images: res.message,
				page: +pageN,
				pages: breadcrum ? this.state.pages : res.pages
			}))
			.then(() => window.scrollTo(0, 0))
			.catch(err => console.log(err))
	}

	getData(url) {
		return callBackendAPI(url)
			.then(res => this.setState({ images: res.message,  pages: res.pages}))
			.catch(err => console.log(err))
	}

	toggleShare = (img, id) => {
		const html = document.getElementById('app')
		html.classList.toggle('is-clipped')
		this.setState({share: !this.state.share, shareImg: img, shareImgID: id})
	}

	componentDidMount() {
		if(!this.props.page){
			return this.getData(`images`)
		}
		return this.gotoPage(this.props.page, false)
	}

	render({}, {images, page}) {
		return (
			<main>
				<Hero />
				{this.state.share && <Share active={this.state.share} close={this.toggleShare} id={this.state.shareImgID} img={this.state.shareImg} />}
				<div class='section'>
					<div class='container'>
						<div class='grid'>
							{images.map((img, idx) => {
								return (
									<div class='card-wrapper'>
										<Card image={img} key={idx} share={this.toggleShare} page={page} />
									</div>
								)
							})}

						</div>
						<section class='section'>
							<nav class="pagination is-centered" role="navigation" aria-label="pagination">
								<ul class='pagination-list'>
									{Array(this.state.pages).fill(0).map((_, i) => {
										i += 1
										return (
											<li><a class={`pagination-link ${i == this.state.page ? 'is-current' : null}`} onClick={this.gotoPage}>{i}</a></li>
										)
									})}
								</ul>
								<a class="pagination-previous" id='prev' onClick={this.handleBreadcrum}>Previous</a>
								<a class="pagination-next" id='next' onClick={this.handleBreadcrum}>Next page</a>
							</nav>
						</section>
					</div>
				</div>
			</main>
		)
	}
	
}
