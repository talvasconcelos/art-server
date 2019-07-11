const dotenv = require('dotenv')
dotenv.config()

const Polka = require('polka')
const bodyParser = require('body-parser')

const db = require('./mongo')
const routes = require('./routes')

const polka = Polka()

const { PORT=3000 } = process.env

polka.use(bodyParser.json())
polka.use(bodyParser.urlencoded({extended: true}))
// polka.use('api', routes)


polka
    .use('api', routes)
    // .get('/', (req, res) => {
    //     res.end(`Hello world!`)
    // })
    // .get('/api/imgs/:id', (req, res) => {
    //     console.log(`${req}`)
    //     res.end(`User: ${req.params.id}`)
    // })
    .listen(PORT, err => {
        if(err) throw err
        console.log(`Running on port: 3000`)
    })