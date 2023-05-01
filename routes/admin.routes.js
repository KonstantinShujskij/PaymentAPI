const {Router} = require('express')
const { auth, adminAccess } = require('../middlware/access.middleware')
const trappiner = require('../trappiner')
const Maker = require('../controllers/maker.controller')
const Access = require('../controllers/access.controller')


const router = Router()

router.post('/refil', auth, adminAccess, trappiner(async (req, res) => {
    const { id, value } = req.body
    
    const balance = await Maker.refil(req.accessId, id, value)

    res.status(200).json({ balance })
}))

router.post('/set-course', auth, adminAccess, trappiner(async (req, res) => {
    const { id, value } = req.body
    
    const course = Access.setCourse(req.accessId, id, value)

    res.status(200).json({ course })
}))



module.exports = router