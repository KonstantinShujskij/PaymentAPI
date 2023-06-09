const {Router} = require('express')
const { auth, makeAccess, takeAccess } = require('../middlware/access.middleware')
const Order = require('../controllers/order.controller')
const trappiner = require('../trappiner')
const { check } = require('express-validator')


const router = Router()

router.post('/create', auth, makeAccess,
    [
        check('card', 'badCardNumber').isCreditCard(),
        check('currency', 'wrongData').isString(),
    ],    
    trappiner(async (req, res) => {
        const { maker, card, value, currency } = req.body
        
        const id = await Order.create(req.accessId, maker, card, value, currency)

        res.status(201).json({ id })
    })
)

router.post('/take', auth, takeAccess, trappiner(async (req, res) => {
    const { order, taker } = req.body
        
    const orderData = await Order.take(req.accessId, order, taker)

    res.status(200).json(orderData)
}))

router.post('/confirm', auth, takeAccess, trappiner(async (req, res) => {
    const { order } = req.body
        
    const orderData = await Order.confirm(req.accessId, order)

    res.status(200).json(orderData)
}))

router.post('/reject', auth, takeAccess, trappiner(async (req, res) => {
    const { order } = req.body
        
    const orderData = await Order.reject(req.accessId, order)

    res.status(200).json(orderData)
}))


router.post('/get', auth, trappiner(async (req, res) => {
    const { id } = req.body

    const order = await Order.get(req.accessId, id)

    res.status(200).json(order)
}))

router.post('/list', auth, takeAccess, trappiner(async (req, res) => {
    const list = await Order.list()

    res.status(200).json(list)
}))

router.post('/maker-list', auth, makeAccess, trappiner(async (req, res) => {
    const { maker } = req.body

    const list = await Order.makerList(req.accessId, maker)

    res.status(200).json(list)
}))

router.post('/taker-list', auth, takeAccess, trappiner(async (req, res) => {
    const { taker } = req.body

    const list = await Order.takerList(req.accessId, taker)

    res.status(200).json(list)
}))

module.exports = router
