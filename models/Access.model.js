const {Schema, model, Types} = require('mongoose')

const schema = new Schema({
    accessToken: {type: String},
    privateToken: {type: String},
    name: {type: String},
    course: { type: Number, default: 40 }
})

module.exports = model('Access', schema)
