const Taker = require('../models/Taker.model')
const dispatch = require('../manager/dispatch')
const actions = require('../manager/actions/taker.actions')
const errors = require('../errors')


async function create(accessId, name) {
    const candidate = await Taker.findOne({ accessId, name })
    if(candidate) { throw errors.userIsExist }

    const taker = new Taker({ accessId, name })
    await taker.save()

    await dispatch(accessId, actions.create(taker))

    return taker._id
}

async function get(accessId, takerId) {
    const taker = await Taker.findOne({ _id: takerId })    
    if(!taker) { throw errors.userNotExist }
    if(!accessId.equals(taker.accessId)) { throw errors.notAccess }

    return {
        id: taker._id,
        name: taker.name
    }
}

async function find(accessId, name) {
    const taker = await Taker.findOne({ accessId, name })    
    if(!taker) { throw errors.userNotExist }
    if(!accessId.equals(taker.accessId)) { throw errors.notAccess }

    return {
        id: taker._id,
        name: taker.name
    }
}

async function list(accessId) {
    const takers = await Taker.find({ accessId })    

    const list = takers.map((taker) => ({
        id: taker._id,
        name: taker.name
    }))

    return list
}

module.exports = {
    create,
    get,
    find,
    list
}