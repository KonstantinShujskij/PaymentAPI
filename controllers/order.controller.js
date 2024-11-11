const Order = require('../models/Order.model')
const Maker = require('./maker.controller')
const Taker = require('./taker.controller')
const Access = require('../models/Access.model') 
const dispatch = require('../manager/dispatch')
const actions = require('../manager/actions/order.actions')
const errors = require('../errors')

const MakerModel = require('../models/Maker.model')
const TakerModel = require('../models/Taker.model')

const status = {
    CREATE: 'CREATE',
    WAIT: 'WAIT',
    CONFIRM: 'CONFIRM',
    REJECT: 'REJECT'
}

async function create(accessId, makerId, card, value, currency, iban) {
    const access = await Access.findOne({ _id: accessId })
    const course = access.course

    if(access.min > value || value > access.max) { throw errors.invalidValue }

    await Maker.withdraw(accessId, makerId, value, course, currency)

    const order = new Order({ accessId, maker: makerId, card, value, course, currency, iban })
    await order.save()

    await dispatch(accessId, actions.create(order))

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

    return { 
        partner: order.accessId,
        id: order._id,
        status: order.status,
        value: order.value,
        course: order.course,
        card: order.card,
        iban: order.iban,
        create: order.createdAt,
        update: order.updatedAt
    }
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

    return { 
        partner: order.accessId,
        id: order._id,
        status: order.status,
        value: order.value,
        course: order.course,
        card: order.card,
        iban: order.iban,
        create: order.createdAt,
        update: order.updatedAt
    }
}

async function reject(accessId, orderId) {
    const order = await closeOrder(accessId, orderId, status.REJECT)

    await Maker.recive(order)

    return { 
        partner: order.accessId,
        id: order._id,
        status: order.status,
        value: order.value,
        course: order.course,
        card: order.card,
        iban: order.iban,
        create: order.createdAt,
        update: order.updatedAt
    }
}

async function get(accessId, orderId) {    
    const order = await Order.findOne({ _id: orderId })
    if(!order) { throw errors.notFind }

    //await Maker.get(accessId, order.maker)

    return {
        partner: order.accessId,
        id: order._id,
        status: order.status,
        value: order.value,
        card: order.card,
        course: order.course,
        currency: order.currency, 
        iban: order.iban,
        create: order.createdAt,
        update: order.updatedAt
    }
}

async function list() {
    const orders = await Order.find({ status: status.CREATE })

    const list = orders.map((order) => ({
        id: order._id,
        status: order.status,
        value: order.value,
        card: order.card,
        iban: order.iban,
        maker: order.maker 
    }))

    return list
}

async function makerList(accessId, makerId) {
    const maker = await Maker.get(accessId, makerId)

    const orders = await Order.find({ maker: maker.id })

    const list = orders.map((order) => ({
        partner: order.accessId,
        id: order._id,
        status: order.status,
        value: order.value,
        card: order.card,
        iban: order.iban,
        currency: order.currency, 
        create: order.createdAt,
        update: order.updatedAt
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
        card: order.card,
        iban: order.iban
    }))

    return list
}

// Admins 

async function listAll(startTime, stopTime, accessId=false) {
    const option = { createdAt: { $gt: startTime, $lt: stopTime } }
    if(accessId) { option.accessId = accessId }

    const orders = await Order.find(option)

    const list = []

    for(let i in orders) {
        const order = orders[i]
        const maker = await MakerModel.findOne({ _id: order.maker })
        const taker = await TakerModel.findOne({ _id: order.taker })
        const access = await Access.findOne({ _id: maker.accessId })

        list.push({
            id: order._id,
            status: order.status,
            value: order.value,
            card: order.card,
            course: order.course,
            currency: order.currency,
            iban: order.iban,
            access: access._id,
            partner: access.name,
            maker: maker.name,
            taker: taker? taker.name : false,
            create: order.createdAt,
            update: order.updatedAt       
        })
    }

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

    listAll,

    status
}