const types = require('../types/maker.types')

const create = (maker) => {
    return {
        type: types.CREATE,
        payload: {
            id: maker._id,
            name: maker.name
        }
    }
}

const refil = (maker) => {
    return {
        type: types.REFIL,
        payload: {
            id: maker._id,
            name: maker.name,
            balance: maker.balance
        }
    }
}

module.exports = {
    create,
    refil
}