const {Router} = require('express')
const { auth } = require('../middlware/access.middleware')
const { check } = require('express-validator')
const { on } = require('../controllers/subscriber.controller')
const trappiner = require('../trappiner')

const router = Router()

router.post('/on', auth, 
    [
        check('url', 'badUrl').isURL({require_protocol: true}),
    ],
    trappiner(async (req, res) => {
        const { url } = req.body

        const subscribe = await on(req.accessId, url)

        res.status(201).json(subscribe)
    })
)

module.exports = router
