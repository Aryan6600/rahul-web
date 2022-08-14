const mongoose = require('../Connection')
const schema = mongoose.Schema({
    name: {
        type: String,
        default: "Player"
    },
    players: {
        type: Array,
        required: false,
    },
    fee: {
        type: Number,
        default: 20,
    },
    roomCode: {
        type: String,
        required: true,
    },
    roomPaas: {
        type: String,
        required: true,
    }
})

const BGMI = mongoose.model('Bgmi Esports', schema)
module.exports = BGMI;