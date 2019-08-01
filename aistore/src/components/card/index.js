import { Link } from 'preact-router'
import { Latent } from '../latent_viz'

export const Card = ({image}) => (
    <div class="card">
        <header class='card-header'>
        </header>
        <div class="card-image" style={{padding: '2em'}}>
            <figure class="image is-128x128" style={{margin: '0 auto'}}>
                <img src={`assets/images/${image.image}`} alt="Placeholder image" />
            </figure>
        </div>
        <div class="card-content">
            <div class="content">
                <div class='columns is-mobile'>
                    <div class='column'>
                        <h6 class='subtitle is-6'>Laten space</h6>
                        <Latent data={image.latent}/>
                    </div>
                    <div class='column'>
                    <h6 class='subtitle is-6'>Specs</h6>
                        <p>Genre: {`${image.genre}`}</p>                        
                    </div>
                </div>                
                <br />
            </div>
        </div>
        <footer class="card-footer">
            <a href="#" class="card-footer-item">
                <span class="icon">
                    <i class="fas fa-heart"></i>
                </span>
                <span>Like</span>
            </a>
            <a href="#" class="card-footer-item">
                <span class="icon">
                    <i class="fas fa-share-alt"></i>
                </span>
                <span>Share</span>
            </a>
            <Link href={`/item/${image._id}`} class="card-footer-item">
                <span class="icon">
                    <i class="fas fa-shopping-bag"></i>
                </span>
                <span>Buy</span>
            </Link>            
        </footer>
    </div>
)
