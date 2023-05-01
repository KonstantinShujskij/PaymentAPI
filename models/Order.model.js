const {Schema, model, Types} = require('mongoose')

const schema = new Schema({
    maker: {type: String},
    taker: {type: String},
    card: {type: String},
    value: {type: Number},
    course: {type: Number},
    status: {type: String, default: "CREATE"}
})

module.exports = model('Order', schema)
