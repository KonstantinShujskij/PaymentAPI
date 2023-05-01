const {Schema, model, Types} = require('mongoose')

const schema = new Schema({
    accessId: {type: String},
    url: {type: String},
})

module.exports = model('Subscriber', schema)
