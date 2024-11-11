const Maker = require('../models/Maker.model')
const dispatch = require('../manager/dispatch')
const actions = require('../manager/actions/maker.actions')
const errors = require('../errors')
const Order = require('../models/Order.model')
const Action = require('../models/Action.model')


async function create(accessId, name) {
    const candidate = await Maker.findOne({ accessId, name })
    if(candidate) { throw errors.userIsExist }

    const maker = new Maker({ accessId, name })
    await maker.save()

    await dispatch(accessId, actions.create(maker))

    return maker._id
}

async function get(accessId, makerId) {
    const maker = await Maker.findOne({ _id: makerId })    
    if(!maker) { throw errors.userNotExist }
    if(!accessId.equals(maker.accessId)) { throw errors.notAccess }

    return {
        id: maker._id,
        name: maker.name,
        balance: maker.balance,
        recive: maker.recive
    }
}

async function find(accessId, name) {
    const maker = await Maker.findOne({ accessId, name })    
    if(!maker) { throw errors.userNotExist }

    return {
        id: maker._id,
        name: maker.name,
        balance: maker.balance,
        recive: maker.recive
    }
}

async function list(accessId) {
    const makers = await Maker.find({ accessId })  
    
    const list = makers.map((maker) => ({
        id: maker._id,
        name: maker.name,
        balance: maker.balance,
        recive: maker.recive
    }))

    return list
}

// Balance Logic

async function refil(accessId, makerId, value={ usdt: 0, uah: 0 }) {   
    const maker = await Maker.findOne({ _id: makerId })    
    if(!maker) { throw errors.userNotExist }

    maker.balance.usdt += value.usdt? parseFloat(value.usdt) : 0
    maker.balance.uah += value.uah? parseFloat(value.uah) : 0

    await maker.save()

    await dispatch(accessId, actions.refil(maker, value))

    return maker.balance
}

async function withdraw(accessId, makerId, value, course, currency) {
    const maker = await Maker.findOne({ _id: makerId })    
    if(!maker) { throw errors.userNotExist }
    if(!accessId.equals(maker.accessId)) { throw errors.notAccess }

    if(maker.balance[currency] === undefined) { throw errors.invalidCurrency }

    if(currency === 'usdt') { 
        const usdt = parseFloat(value) / parseFloat(course)
        if(Math.abs(maker.balance.usdt - usdt) < 0.001 ) { throw errors.lowBalance }

        maker.balance.usdt -= usdt
        maker.recive.usdt += usdt
    }   

    if(currency === 'uah') {
        const uah = parseFloat(value)

        if(Math.abs(maker.balance.uah - uah) < 0.001 ) { throw errors.lowBalance }

        maker.balance.uah -= uah
        maker.recive.uah += uah
    }

    await maker.save()
}

async function recive(order) {
    const maker = await Maker.findOne({ _id: order.maker })    
    if(!maker) { throw errors.userNotExist }

    if(order.currency === 'usdt') { 
        const usdt = parseFloat(order.value) / parseFloat(order.course)

        if(Math.abs(maker.recive.usdt - usdt) < 0.001 ) { throw errors.lowBalance }

        maker.recive.usdt -= usdt
        maker.balance.usdt += usdt
    }   

    if(order.currency === 'uah') {
        const uah = parseFloat(order.value)

        if(Math.abs(maker.recive.uah - uah) < 0.001 ) { throw errors.lowBalance }

        maker.recive.uah -= uah
        maker.balance.uah += uah
    }

    await maker.save()
}

async function remove(order) {
    const maker = await Maker.findOne({ _id: order.maker })    
    if(!maker) { throw errors.userNotExist }    
    
    if(order.currency === 'usdt') { 
        const usdt = parseFloat(order.value) / parseFloat(order.course)

        if(Math.abs(maker.recive.usdt - usdt) < 0.001 ) { throw errors.lowBalance }

        maker.recive.usdt -= usdt
    }   

    if(order.currency === 'uah') {
        const uah = parseFloat(order.value)

        if(Math.abs(maker.recive.uah - uah) < 0.001 ) { throw errors.lowBalance }

        maker.recive.uah -= uah
    }

    await maker.save()
}

async function rebalance(makerId) {
    const maker = await Maker.findOne({ _id: makerId })    
    if(!maker) { throw errors.userNotExist }

    const orders = await Order.find({ maker: makerId })

    let balance = {
        uah: 0,
        usdt: 0
    }

    const payments = await Action.find({ type: 'MAKER REFIL' })

    payments.forEach((payment) => {
        if(payment.payload.id.toString() === makerId) {
            balance.uah += payment.payload.balance.uah
            balance.usdt += payment.payload.balance.usdt
        }
    })

    let recive = {
        uah: 0,
        usdt: 0
    }

    orders.forEach((order) => {
        if(order.status === 'CONFIRM') {
            if(order.currency === 'uah') { balance.uah -= order.value }
            if(order.currency === 'usdt') { balance.usdt -= order.value / order.course }
        }
        if(order.status === 'WAIT' || order.status === 'CREATE') {
            if(order.currency === 'uah') { 
                balance.uah -= order.value
                recive.uah += order.value 
            }
            if(order.currency === 'usdt') { 
                balance.usdt -= order.value / order.course
                recive.usdt += order.value / order.course 
            }
        }
    })

    balance.uah = parseFloat(balance.uah.toFixed(2))
    balance.usdt = parseFloat(balance.usdt.toFixed(2))
    recive.uah = parseFloat(recive.uah.toFixed(2))
    recive.usdt = parseFloat(recive.usdt.toFixed(2))

    maker.balance = balance
    maker.recive = recive

    await maker.save()

    return {balance, recive}
}

module.exports = {
    create,
    get,
    find,
    list,

    refil,
    withdraw,
    recive,
    remove,
    rebalance
}