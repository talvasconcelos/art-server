import { Twitter, Facebook, Pinterest, Reddit, Whatsapp, Telegram } from 'react-social-sharing'

export const Share = ({active, close, img, id}) => (
    <div class={`modal ${active ? 'is-active' : ''}`} style={{padding: '1em'}}>
        <div class="modal-background"></div>
        <div class="modal-content has-background-white share">
            <div class='media'>
                <div class='column'>
                    <figure class="media-left">
                        <p class="image is-128x128">
                        <img src={`assets/images/${img}`} />
                        </p>
                    </figure>
                </div>
            </div>
            <div class='media-content'>
                <div class='content'>
                    <div>
                        <p><strong>AI Art Nudes</strong>
                        <br/>
                        Share this AI artwork...
                        </p>
                    </div>
                    <div>
                        <Twitter solid small link={`https://nudeart.sparkpay.pt/item/${id}`}/>
                        <Facebook solid small link={`https://nudeart.sparkpay.pt/item/${id}`}/>
                        <Pinterest solid small link={`https://nudeart.sparkpay.pt/item/${id}`}/>
                        <Reddit solid small link={`https://nudeart.sparkpay.pt/item/${id}`}/>
                        <Whatsapp solid small link={`https://nudeart.sparkpay.pt/item/${id}`}/>
                        <Telegram solid small link={`https://nudeart.sparkpay.pt/item/${id}`}/>
                    </div>
                </div>
            </div>
        </div>
        <button class="modal-close is-large" aria-label="close" onClick={close}></button>
    </div>
)