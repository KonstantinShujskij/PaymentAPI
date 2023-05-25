const {Schema, model, Types} = require('mongoose')

const schema = new Schema({
    accessId: {type: String},
    maker: {type: String},
    taker: {type: String},
    card: {type: String},
    value: {type: Number},
    course: {type: Number},
    currency: {type: String},
    status: {type: String, default: "CREATE"},

    createdAt: {type: Number},
    updatedAt: {type: Number}
}, {
    timestamps: { currentTime: () => Date.now() }
})

module.exports = model('Order', schema)
