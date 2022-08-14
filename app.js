const express = require('express')
const cookieParser = require('cookie-parser')
const path = require('path')
const { body, validationResult } = require('express-validator');
const transporter = require('./database/transporter')
const uuid = require('uuid')
const jwt = require('jsonwebtoken')

const app = express()
app.use(cookieParser())
app.set('view engine', 'ejs')
app.use(express.static(path.join(__dirname, 'public')))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

const CheckLogin = require('./middlewares/checkLogin')
const isLoggedIn = require('./middlewares/isLoggedIn')

const User = require('./database/Schemas/Users');
const Config = require('./Config');
const BGMI = require('./database/Schemas/BGMIEsports')

app.get('/', CheckLogin, async (req, res) => {
    const user = req.user
    const balance = await User.findOne({ _id: user.id }).select("wallet")
    res.render('Home', { wallet: balance.wallet })
})
app.get('/verify', async (req, res) => {
    try {
        const params = await req.query.token
        const user = await User.findOne({ loginToken: String(params) })
        const token = await jwt.sign({ id: user._id, name: user.name, email: user.email }, Config.JWT_SECREAT)
        await User.updateOne({ loginToken: params }, { $set: { loginToken: uuid.v4() } })
        await res.cookie('token', token, { path: '/', maxAge: 3600 * 3600 * 60 * 24 })
        await res.render('msg', { msg: 'Sucessfully Logged In. Go Back to website to activate ur account' })
    } catch (error) {
        res.redirect('/login')
    }
})
app.get('/login', isLoggedIn, (req, res) => {
    res.render('login')
    res.end()
})
app.post('/login', isLoggedIn, [
    body('email').isEmail()
], async (req, res) => {
    const errors = await validationResult(req);
    if (!errors.isEmpty()) return res.status(400).send('Hello')
    const email = req.body.email
    const user = await User.findOne({ email: email })
    if (!user) {
        const loginToken = await uuid.v4()
        await User.create({
            email,
            loginToken
        }).then(user => {
            var mailOptions = {
                from: 'softtech88820@gmail.com',
                to: user.email,
                subject: 'Login To Rinzo',
                text: `Your One Time Login link for Rinzo is http://${req.get('host')}/verify?token=${user.loginToken} please dont share it with anyone . we never ask you for your Link. Thank You. Rinzo`
            };
            transporter.sendMail(mailOptions, (err, result) => {
                if (!err) {
                    res.render('msg', { msg: 'Login Link Sent to ur Mail ID' })
                } else {
                    res.render('msg', { msg: "Error Sending Email" })
                }
            })
        })
    } else {
        var mailOptions = {
            from: 'softtech88820@gmail.com',
            to: user.email,
            subject: 'Login To Rinzo',
            text: `Your One Time Login link for Rinzo is http://${req.get('host')}/verify?token=${user.loginToken} please dont share it with anyone . we never ask you for your Link. Thank You. Rinzo`
        };
        transporter.sendMail(mailOptions, (err, result) => {
            if (!err) {
                res.render('msg', { msg: 'Login Link Sent to ur Mail ID' })
            } else {
                res.render('msg', { msg: "Error Sending Email" })
            }
        })
    }
})

app.get('/wallet', CheckLogin, async (req, res) => {
    const user = req.user
    const balance = await User.findOne({ _id: user.id }).select("wallet")
    res.render('wallet', { balance: balance.wallet, coins: 20 })
})
app.get('/trading', CheckLogin, (req, res) => {
    res.render('trading')
})
app.get('/offers', CheckLogin, (req, res) => {
    res.render('offers')
})
app.get('/battles', CheckLogin, (req, res) => {
    res.render('battle')
})
// app.get('/esports', CheckLogin, (req, res) => {
//     res.render('esports/index.ejs', { wallet: 10 })
// })
app.get('/cricket-battles', CheckLogin, (req, res) => {
    res.render('cricket-battles')
})
app.get('/esports', CheckLogin, async (req, res) => {
    const data = await BGMI.find({})
    res.render('bgmiesports/index.ejs', { wallet: 0, data })
})
app.get('/results', CheckLogin, (req, res) => {
    res.render('results')
})
app.get('/join', CheckLogin, (req, res) => {
    res.render('join')
})
app.listen(80, () => {
    console.log("Devlopment Server is running");
})