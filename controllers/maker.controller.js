const Maker = require('../models/Maker.model')
const dispatch = require('../manager/dispatch')
const actions = require('../manager/actions/maker.actions')
const errors = require('../errors')


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

    await dispatch(accessId, actions.refil(maker))

    return maker.balance
}

async function withdraw(accessId, makerId, value, course, currency) {
    const maker = await Maker.findOne({ _id: makerId })    
    if(!maker) { throw errors.userNotExist }
    if(!accessId.equals(maker.accessId)) { throw errors.notAccess }

    if(!maker.balance[currency]) { throw errors.invalidCurrency }

    if(currency === 'usdt') { 
        const usdt = value / course
        if(maker.balance.usdt < usdt) { throw errors.lowBalance }

        maker.balance.usdt -= usdt
        maker.recive.usdt += usdt
    }   

    if(currency === 'uah') {
        const uah = value
        if(maker.balance.uah < uah) { throw errors.lowBalance }

        maker.balance.uah -= uah
        maker.recive.uah += uah
    }

    await maker.save()
}

async function recive(order) {
    const maker = await Maker.findOne({ _id: order.maker })    
    if(!maker) { throw errors.userNotExist }

    if(order.currency === 'usdt') { 
        const usdt = order.value / order.course
        if(maker.recive.usdt < usdt) { throw errors.lowBalance }

        maker.recive.usdt -= usdt
        maker.balance.usdt += usdt
    }   

    if(order.currency === 'uah') {
        const uah = order.value
        if(maker.recive.uah < uah) { throw errors.lowBalance }

        maker.recive.uah -= uah
        maker.balance.uah += uah
    }

    await maker.save()
}

async function remove(order) {
    const maker = await Maker.findOne({ _id: order.maker })    
    if(!maker) { throw errors.userNotExist }    
    
    if(order.currency === 'usdt') { 
        const usdt = order.value / order.course
        if(maker.recive.usdt < usdt) { throw errors.lowBalance }

        maker.recive.usdt -= usdt
    }   

    if(order.currency === 'uah') {
        const uah = order.value
        if(maker.recive.uah < uah) { throw errors.lowBalance }

        maker.recive.uah -= uah
    }

    await maker.save()
}

module.exports = {
    create,
    get,
    find,
    list,

    refil,
    withdraw,
    recive,
    remove
}