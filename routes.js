const polka = require('polka')
const models = require('./images')

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