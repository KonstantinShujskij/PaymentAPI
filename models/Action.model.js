const {Schema, model, Types} = require('mongoose')

const schema = new Schema({
    initializer: {type: String},
    type: {type: String},
    payload: {type: Object}
})

module.exports = model('Action', schema)
