const types = require('../types/taker.types')

const create = (taker) => {
    return {
        type: types.CREATE,
        payload: {
            id: taker._id,
            name: taker.name
        }
    }
}

module.exports = {
    create
}