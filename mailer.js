const mailer = require('nodemailer')

const transport = mailer.createTransport({
    host: 'smtp.securemail.pro',
    port: 465,
    auth: {
       user: process.env.MAIL_USER,
       pass: process.env.MAIL_PASS
    }
})

const message = {
    from: 'geral@sparkpay.pt', // Sender address
    to: 'talvasconcelos@gmail.com',         // List of recipients
    subject: 'Design Your Model S | Tesla', // Subject line
    text: 'Have the most fun you can in a car. Get your Tesla today!' // Plain text body
}

const sendMail = (message) => {
    return transport.sendMail(message, (err, info) => {
        if (err) {
          console.log(err)
        } else {
          console.log(info)
        }
    })
}



module.exports = sendMail