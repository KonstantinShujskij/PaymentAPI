const {Schema, model, Types} = require('mongoose')

const schema = new Schema({
    accessToken: {type: String},
    privateToken: {type: String},
    name: {type: String},
    course: { type: Number, default: 40 },
    min: { type: Number, default: 100 },
    max: { type: Number, default: 1000000 }
})

module.exports = model('Access', schema)
