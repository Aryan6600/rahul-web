const mongoose = require('../Connection')
const uuid = require('uuid')
const schema = mongoose.Schema({
    name: {
        type: String,
        default: "Player"
    },
    email: {
        type: String,
        required: true,
    },
    wallet: {
        type: Number,
        default: 20,
    },
    loginToken: {
        type: String,
        default: uuid.v4()
    },
})

const User = mongoose.model('User', schema)
module.exports = User;