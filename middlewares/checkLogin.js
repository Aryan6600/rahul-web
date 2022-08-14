const jwt = require('jsonwebtoken')
const JWT_SECREAT = require('../Config').JWT_SECREAT

const CheckLogin = (req, res, next) => {
    if (!req.cookies.token) return res.redirect('/login')
    try {
        const token = req.cookies.token
        const user = jwt.verify(token, JWT_SECREAT)
        req.user = user;
        return next()
    } catch (error) {
        res.redirect('/login')
        next()
    }
}

module.exports = CheckLogin;
