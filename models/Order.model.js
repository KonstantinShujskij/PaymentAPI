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
    iban: {
        number: {type: String, default: ''},
        INN: {type: String, default: ''},
        target: {type: String, default: ''},
        recipient: {type: String, default: ''}
    },

    createdAt: {type: Number},
    updatedAt: {type: Number}
}, {
    timestamps: { currentTime: () => Date.now() }
})

module.exports = model('Order', schema)
