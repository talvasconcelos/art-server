const dotenv = require('dotenv')
dotenv.config()

const Polka = require('polka')
const bodyParser = require('body-parser')
const cors = require('cors')

const routes = require('./routes')

const polka = Polka()

const { PORT=3000 } = process.env

polka.use(bodyParser.json())
polka.use(bodyParser.urlencoded({extended: true}))

polka
    .use(cors())
    .use('api', routes)
    .listen(PORT, err => {
        if(err) throw err
        console.log(`Running on port: ${PORT}`)
    })