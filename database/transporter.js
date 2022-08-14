var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: "softtech88820@gmail.com",
        pass: 'hvuwnrfsqbhskbea'
    }
});

module.exports = transporter;