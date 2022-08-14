const mongoose = require('mongoose')
mongoose.connect("mongodb://localhost:27017/Rinzo")
    .then(data => {
        console.log("Sucessfully Connected to MONGODB")
    })
    .catch(error => {
        console.log(error)
    })

module.exports = mongoose;