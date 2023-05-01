const {Schema, model, Types} = require('mongoose')

const schema = new Schema({
    accessId: {type: String},
    name: {type: String}
})

module.exports = model('Taker', schema)
