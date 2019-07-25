import { h } from 'preact';
import { Card } from '../../components/card'

const Home = ({ images }) => (
	<div class='section'>
		<div class='container'>
			<div class='grid'>
				{images.map((img, idx) => {
					return (
						<div class='card-wrapper'>
							<Card image={img}/>
							{/* <div style={{width: '100%', heigth: 'auto', padding: '64px', background: 'cyan'}}></div> */}
						</div>
					)
				})}

			</div>
			<nav class="pagination is-centered" role="navigation" aria-label="pagination">
				<a class="pagination-previous">Previous</a>
				<a class="pagination-next">Next page</a>
			</nav>
		</div>
	</div>
);

export default Home;
