const {Router} = require('express')
const { auth, takeAccess } = require('../middlware/access.middleware')
const Taker = require('../controllers/taker.controller')
const trappiner = require('../trappiner')

const router = Router()

router.post('/create', auth, takeAccess, trappiner(async (req, res) => {
    const { name } = req.body
    
    const taker = await Taker.create(req.accessId, name)

    res.status(201).json(taker)
}))

router.post('/get', auth, takeAccess, trappiner(async (req, res) => {
    const { id } = req.body
    
    const taker = await Taker.get(req.accessId, id)

    res.status(200).json(taker)
}))

router.post('/find', auth, takeAccess, trappiner(async (req, res) => {
    const { name } = req.body
    
    const taker = await Taker.find(req.accessId, name)

    res.status(200).json(taker)
}))

router.post('/list', auth, takeAccess, trappiner(async (req, res) => {   
    const list = await Taker.list(req.accessId)

    res.status(200).json(list)
}))


module.exports = router