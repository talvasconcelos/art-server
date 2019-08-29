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
        const images = await models.getImages(req.query.pageNo, req.query.size)        
        res.end(JSON.stringify(images, null, 2))
    })
    .get('/images/:id', async (req, res) => {
        const image = await models.getSingleImage(req.params.id)
        // console.log(req.params.id)
        res.end(JSON.stringify(image, null, 2))
    })
    .get('/download/:id', async (req, res) => {
        const image = await models.getImageDownload(req.params.id)
        if(!image) {
            res.end(JSON.stringify({error: true, message: 'Not a valid link!'}))
        }
        res.end(JSON.stringify(image, null, 2))
    })
    .post('/payments/notify', async (req, res) => {
        console.log('check invoice')
        const status = await checkInvoice(req.body.id)
        if(!status || status === 'undefined'){
            res.end()
            return
        }
        const invoiceStatus = status.data.status
        console.log(invoiceStatus)
        // console.log(status.data.orderId)
        if(invoiceStatus === 'confirmed' || invoiceStatus === 'complete'){
            console.log('Download')
            const url = await models.updateImage(status.data.orderId)
            if(!url) {
                res.end()
                return
            }
            const message = {
                from: process.env.MAIL_SENDER, // Sender address
                to: status.data.buyer.email,// List of recipients
                subject: 'Your painting download is ready!', // Subject line
                text: `Your payment just got confirmed. You can proceed to the link bellow to download your painting!\n
                Link: https://nudeart.sparkpay.pt/download/${url.downloadID}` // Plain text body
            }
            console.log(url.downloadID)
            await mailer(message)
        }
        if(invoiceStatus === 'paid'){
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
