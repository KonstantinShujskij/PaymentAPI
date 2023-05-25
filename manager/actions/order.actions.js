const types = require('../types/order.types')

const create = (order) => {
    return {
        type: types.CREATE,
        payload: {
            id: order._id,
            status: order.status 
        }
    }
}

const update = (order) => {
    return {
        type: types.UPDATE,
        payload: {
            id: order._id,
            status: order.status 
        }
    }
}

module.exports = {
    create,
    update,
}