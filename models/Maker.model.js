const {Schema, model, Types} = require('mongoose')

const schema = new Schema({
    accessId: {type: String},
    name: {type: String},
    balance: {
        usdt: {type: Number, default: 0},
        uah: {type: Number, default: 0}
    },
    recive: {
        usdt: {type: Number, default: 0},
        uah: {type: Number, default: 0}
    }
})

module.exports = model('Maker', schema)
