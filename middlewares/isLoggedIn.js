const jwt = require('jsonwebtoken')
const JWT_SECREAT = require('../Config').JWT_SECREAT

const isLoggedIn = (req, res, next) => {
    try {
        const token = req.cookies.token
        jwt.verify(token, JWT_SECREAT)
        return res.redirect('/')
    } catch (error) {
        res.clearCookie('token')
        return next()
    }
}

module.exports = isLoggedIn;