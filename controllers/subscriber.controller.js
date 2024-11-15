const Subscriber = require('../models/Subscriber.model')
const request = require('request')

const Access = require('../models/Access.model')
const Maker = require('../models/Maker.model')
const Taker = require('../models/Taker.model')
const Order = require('../models/Order.model')

const orderTypes = require('../manager/types/order.types')
const accessTypes = require('../manager/types/access.types')

const jwt = require('jsonwebtoken')
const config = require('config')


const on = async (accessId, url) => {
    let subscriber = await Subscriber.findOne({ accessId })
    if(!subscriber) { subscriber = new Subscriber({ accessId }) }

    subscriber.url = url
    await subscriber.save()

    return { url: subscriber.url }
}

const pull = (url, body) => {
    const options = { url, headers: { "content-type": "application/json" }, body, json: true }

    request.post(options, (err, res, _body) => { 

        if(res.statusCode !== 200) {
            setTimeout(() => {
                pull(url, body)
            }, 1000 + parseInt(Math.random() * 1000))
        }

        if(err) {
            // Alert!
        }
    })
}

const getAccessList = async (action) => {
    const list = new Set()

    if(action.type === orderTypes.UPDATE) { 
        const order = await Order.findOne({ _id: action.payload.id})

        const maker = await Maker.findOne({ _id: order.maker })
        list.add(maker.accessId.toString())

        if(!order.taker) { return list }

        const taker = await Taker.findOne({ _id: order.taker })
        list.add(taker.accessId.toString())

        return list
    }

    if(action.type === orderTypes.CREATE) { 
        const secret = config.get('jwtSecret')
        const accessList = await Access.find()

        accessList.forEach((access) => {
            const decoded = jwt.verify(access.accessToken, secret)
            if(decoded.accessList?.take) { list.add(access._id.toString()) } 
        })

        return list
    }

    if(action.type === accessTypes.SET_COURSE) { 
        list.add(action.payload.id.toString())

        return list
    }

    return list
}

const listen = async (action) => {
    return

    const list = await Subscriber.find()
    const accessList = await getAccessList(action)

    const secret = config.get('jwtSecret')

    list.forEach(async (subscriber) => {     
        const accessId = subscriber.accessId.toString()
        
        if(!accessList.has(accessId)) { 
            const access = await Access.findOne({ _id: accessId })
            const decoded = jwt.verify(access.accessToken, secret)

            if(!decoded.accessList.admin) { return } 
        }

        const endPoint = action.type.toLowerCase().replaceAll(' ', '/')
        const url = `${subscriber.url}/${endPoint}`

        pull(url, action.payload)
    })
}

module.exports = {
    listen,
    on
}