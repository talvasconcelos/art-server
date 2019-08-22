import { Link } from 'preact-router'
import { Latent } from '../latent_viz'

export const Card = ({image, page, share}) => (
    <div class="card">
        <header class='card-header'>
            <p class="card-header-title">
            ฿0.00010000
            </p>
        </header>
        <div class="card-image" style={{padding: '4em 0'}}>
            <Link href={`/item/${image._id}?page=${page}`} >
                <figure class="image is-128x128" style={{margin: '0 auto'}}>
                    <img src={`assets/images/${image.image}`} alt="Placeholder image" />
                </figure>
            </Link>
        </div>
        <div class="card-content">
            <div class="content">
                <div class='columns is-mobile'>
                    <div class='column'>
                        <h6 class='subtitle'>Latent space</h6>
                        <Latent data={image.latent}/>
                    </div>
                    <div class='column'>
                    <h6 class='subtitle'>Specs</h6>
                        <div class='is-size-7'>
                            <p>Genre: {`${image.genre}`}</p>
                        </div>
                                             
                    </div>
                </div>                
                <br />
            </div>
        </div>
        <footer class="card-footer">
            {/* <p class="card-footer-item has-text-link">
                <span class="icon">
                    <i class="fa fa-heart"></i>
                </span>
                <span>Like</span>
            </p> */}
            <p class="card-footer-item has-text-link" onClick={() => share(image.image, image._id)}>
                <span class="icon">
                    <i class="fa fa-share-alt"></i>
                </span>
                <span>Share</span>
            </p>
            <Link href={`/item/${image._id}?page=${page}`} class="card-footer-item" >
                <span class="icon">
                    <i class="fa fa-shopping-bag"></i>
                </span>
                <span>Buy</span>
            </Link>            
        </footer>
    </div>
)
