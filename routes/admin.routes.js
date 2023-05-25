const {Router} = require('express')
const { auth, adminAccess } = require('../middlware/access.middleware')
const trappiner = require('../trappiner')
const Maker = require('../controllers/maker.controller')
const Access = require('../controllers/access.controller')
const Order = require('../controllers/order.controller')


const router = Router()

router.post('/refill', auth, adminAccess, trappiner(async (req, res) => {
    const { id, value } = req.body
    
    const balance = await Maker.refil(req.accessId, id, value)

    res.status(200).json({ balance })
}))

router.post('/get-partners', auth, adminAccess, trappiner(async (req, res) => {    
    const partners = await Access.getPartners()

    res.status(200).json(partners)
}))

router.post('/set-course', auth, adminAccess, trappiner(async (req, res) => {
    const { id, value } = req.body
    
    const partner = await Access.setCourse(req.accessId, id, value)

    res.status(200).json(partner)
}))

router.post('/get-orders', auth, adminAccess, trappiner(async (req, res) => {
    const { timeStart, timeStop, partner } = req.body
    
    const list = await Order.listAll(timeStart, timeStop, partner)

    res.status(200).json(list)
}))


router.post('/get-makers', auth, adminAccess, trappiner(async (req, res) => {
    const { partner } = req.body
    
    const list = await Maker.list(partner)

    res.status(200).json(list)
}))


module.exports = router