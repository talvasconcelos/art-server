const Mongoose = require('mongoose')
const mongoURI = process.env.MDB_URI

Mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    auth: {
        user: process.env.MDB_USER,
        password: process.env.MDB_PASS
    }
})

const conn = Mongoose.connection

conn.on('error', console.error.bind(console, 'connection error:'))

conn.once('open', () => {
    console.log('The Mongoose connection is ready')
})

module.exports = conn
