const polka = require('polka')
const http = require('httpie')
const models = require('./images')
const mailer = require('./mailer')

const checkInvoice = async (id) => {
    // console.log(body)
    const { data } = await http.get(`${process.env.CHECK_INV_URL}/invoices/${id}`, {
        headers: {
            Accept: '*/*',
            'Content-Type': 'application/json',
            Authorization: process.env.CHECK_INV_KEY
            }
    })
    .catch(err => {
        //console.error(err)
        return false
    })
    return data
}


module.exports = polka()
    .get('/', (req, res) => {
        res.end(`Hello world!`)
    })
    .get('/images', async (req, res) => {
        const images = await models.getImages(req.query.pageNo, req.query.size).catch(console.error)     
        res.end(JSON.stringify(images, null, 2))
    })
    .get('/images/:id', async (req, res) => {
        const image = await models.getSingleImage(req.params.id).catch(console.error)
        // console.log(req.params.id)
        res.end(JSON.stringify(image, null, 2))
    })
    .get('/download/:id', async (req, res) => {
        const image = await models.getImageDownload(req.params.id).catch(console.error)
        if(!image) {
            res.end(JSON.stringify({error: true, message: 'Not a valid link!'}))
        }
        res.end(JSON.stringify(image, null, 2))
    })
    .get('/delete/:id', async (req, res) => {
        const msg = await models.deleteImage(req.params.id).catch(console.error)
        res.end(JSON.stringify(msg))
    })
    .post('image/update/:id', async (req, res) => {
        const msg = await models.imageUpdateNotExclusive(req.params.id)
        res.end(JSON.stringify(msg))
    })
    .post('/payments/notify', async (req, res) => {
        console.log('check invoice')
        const status = await checkInvoice(req.body.id)
        if(!status || status === 'undefined'){
            res.end()
            return
        }

        const lnd = status.data.paymentTotals.btC_LightningLike
        const invoiceStatus = status.data.status
        
        console.log(invoiceStatus)
        if(lnd && invoiceStatus === 'complete'){
            console.log('Lightning Payment')
            await models.lndBuy(status.data.orderId)
                .then((msg) => {
                    if(!msg) { return res.end() }
                    const link = `https://nudeart.sparkpay.pt/download/${msg.downloadID}`
                    const message = {
                        from: process.env.MAIL_SENDER, // Sender address
                        to: status.data.buyer.email,// List of recipients
                        subject: 'Your painting download is ready!', // Subject line
                        text: `Your Lightning Network payment is confirmed. You can proceed to the link bellow to download your painting!\n
                        Link: ${link}` // Plain text body
                    }
                    return message
                })
                .then(m => mailer(m))
                .catch(console.error)
        }
        // console.log(status.data.orderId)
        if(!lnd && (invoiceStatus === 'confirmed' || invoiceStatus === 'complete')){
            console.log('Download')
            await models.updateImage(status.data.orderId)
                .then((msg) => {
                    if(!msg) { return res.end() }
                    const link = `https://nudeart.sparkpay.pt/download/${msg.downloadID}`
                    const message = {
                        from: process.env.MAIL_SENDER, // Sender address
                        to: status.data.buyer.email,// List of recipients
                        subject: 'Your painting download is ready!', // Subject line
                        text: `Your payment just got confirmed. You can proceed to the link bellow to download your painting!\n
                        Link: ${link}` // Plain text body
                    }
                    return message
                })
                .then(m => mailer(m))
                .catch(console.error)
        }
        if(!lnd && invoiceStatus === 'paid'){
            await models.markImagePaid(status.data.orderId)
            console.log('Await at least 1 confirmation!')
            const message = {
                from: process.env.MAIL_SENDER, // Sender address
                to: status.data.buyer.email,         // List of recipients
                subject: 'Thank you for your support!', // Subject line
                text: `Hi, I just got your payment. For security reasons your download will only be available after at least 1 network confirmation. I'll contact you as soon as it's confirmed.` // Plain text body
            }
            await mailer(message)
        }
        // if(invoiceStatus === '')
        res.end()
    })
