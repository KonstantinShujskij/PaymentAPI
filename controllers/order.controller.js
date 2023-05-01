const Order = require('../models/Order.model')
const Maker = require('./maker.controller')
const Taker = require('./taker.controller')
const Access = require('../models/Access.model') 
const dispatch = require('../manager/dispatch')
const actions = require('../manager/actions/order.actions')
const errors = require('../errors')


const status = {
    CREATE: 'CREATE',
    WAIT: 'WAIT',
    CONFIRM: 'CONFIRM',
    REJECT: 'REJECT'
}

async function create(accessId, makerId, card, value) {
    const access = await Access.findOne({ _id: accessId })
    const course = access.course

    await Maker.withdraw(accessId, makerId, value, course)

    const order = new Order({ maker: makerId, card, value, course })
    await order.save()

    await dispatch(accessId, actions.update(order))

    return order._id
}

async function take(accessId, orderId, takerId) {
    const taker = await Taker.get(accessId, takerId)

    const order =  await Order.findOne({ _id: orderId })
    if(!order) { throw errors.notFind }
    if(order.status !== status.CREATE) { throw errors.notCanTake }

    order.status = status.WAIT
    order.taker = taker.id

    await order.save()

    await dispatch(accessId, actions.update(order))

    return order.status
}

async function closeOrder(accessId, orderId, closeStatus) {
    const order = await Order.findOne({ _id: orderId })
    if(!order) { throw errors.notFind }
    if(order.status !== status.WAIT) { throw errors.OrderNotWait }

    await Taker.get(accessId, order.taker)

    order.status = closeStatus
    await order.save()

    await dispatch(accessId, actions.update(order))

    return order
}

async function confirm(accessId, orderId) {
    const order = await closeOrder(accessId, orderId, status.CONFIRM)

    await Maker.remove(order)

    return order.status
}

async function reject(accessId, orderId) {
    const order = await closeOrder(accessId, orderId, status.REJECT)

    await Maker.recive(order)

    return order.status
}

async function get(accessId, orderId) {
    const order = await Order.findOne({ _id: orderId })
    if(!order) { throw errors.notFind }

    await Maker.get(accessId, order.maker)

    return {
        id: order._id,
        status: order.status,
        value: order.value,
        card: order.card
    }
}

async function list() {
    const orders = await Order.find({ status: status.CREATE })

    const list = orders.map((order) => ({
        id: order._id,
        status: order.status,
        value: order.value,
        card: order.card,
        maker: order.maker 
    }))

    return list
}

async function makerList(accessId, makerId) {
    const maker = await Maker.get(accessId, makerId)

    const orders = await Order.find({ maker: maker.id })

    const list = orders.map((order) => ({
        id: order._id,
        status: order.status,
        value: order.value,
        card: order.card
    }))

    return list
}

async function takerList(accessId, takerId) {
    const taker = await Taker.get(accessId, takerId)

    const orders = await Order.find({ taker: taker.id })

    const list = orders.map((order) => ({
        id: order._id,
        status: order.status,
        value: order.value,
        card: order.card
    }))

    return list
}

module.exports = { 
    create, 
    take,
    confirm,
    reject,
    get,
    list,
    makerList,
    takerList,
    status
}