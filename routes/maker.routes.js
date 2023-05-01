const {Router} = require('express')
const { auth, makeAccess } = require('../middlware/access.middleware')
const Maker = require('../controllers/maker.controller')
const trappiner = require('../trappiner')


const router = Router()

router.post('/create', auth, makeAccess, trappiner(async (req, res) => {
    const { name } = req.body
    
    const id = await Maker.create(req.accessId, name)

    res.status(201).json({ id })
}))

router.post('/get', auth, makeAccess, trappiner(async (req, res) => {
    const { id } = req.body
    
    const maker = await Maker.get(req.accessId, id)

    res.status(200).json(maker)
}))

router.post('/find', auth, makeAccess, trappiner(async (req, res) => {
    const { name } = req.body
    
    const maker = await Maker.find(req.accessId, name)

    res.status(200).json(maker)
}))

router.post('/list', auth, makeAccess, trappiner(async (req, res) => {   
    const list = await Maker.list(req.accessId)

    res.status(200).json(list)
}))


module.exports = router