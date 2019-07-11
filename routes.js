const polka = require('polka')

module.exports = polka()
    .get('/', (req, res) => {
        res.end(`Hello world!`)
    })
    .get('/images', (req, res) => {
        res.end()
    })
    .get('/image/:id', (req, res) => {
        res.end(JSON.stringify(req.params))
    })