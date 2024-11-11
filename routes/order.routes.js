const {Router} = require('express')
const { auth, makeAccess, takeAccess } = require('../middlware/access.middleware')
const Order = require('../controllers/order.controller')
const trappiner = require('../trappiner')
const { check } = require('express-validator')
const errors = require('../errors')


const router = Router()


router.post('/create', auth, makeAccess,
    [
        check('card', 'badCardNumber').optional().isCreditCard(),
        check('currency', 'wrongData').isString(),

        check('iban', 'incorectIban').optional().isObject(),
        check('iban.number', 'incorectIban').if(check('iban').exists()).isIBAN(),
        check('iban.INN', 'incorectINN').if(check('iban').exists()).isString().notEmpty(),
        check('iban.recipient', 'incorectValue').if(check('iban').exists()).isString().notEmpty(),
    ],    
    trappiner(async (req, res) => {
        const { maker, value, currency, iban } = req.body
        let { card } = req.body
        
        if(!card) {
            if(iban) { card = '4111111111111111' } 
            else { throw errors.incorectNumber  }
        }   
        if(iban) { iban.target = 'Переказ коштів' }        

        const id = await Order.create(req.accessId, maker, card, value, currency, iban)

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
