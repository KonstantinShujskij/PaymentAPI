const types = require('../types/order.types')

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
    update,
}