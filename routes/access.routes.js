const {Router} = require('express')
const { auth, adminAccess } = require('../middlware/access.middleware')
const Access = require('../controllers/access.controller')
const { check } = require('express-validator')
const trappiner = require('../trappiner')
const AccessModel = require('../models/Access.model')

const router = Router()

router.post('/create', auth, adminAccess,
    [ 
        check('name', 'wrongData').isString(),
        check('course', 'wrongData').optional().isFloat({ min: 0 }),
        check('min', 'wrongData').optional().isFloat({ min: 0 }),
        check('max', 'wrongData').optional().isFloat({ min: 0 }),
    ],
    trappiner(async (req, res) => {
        const { name, course, min, max, access } = req.body
        const { admin, take, make } = access || {}
        const accessList = { admin: !!admin, take: !!take, make: !!make }
        
        const auth = await Access.create(req.accessId, name, course, min, max, accessList)

        res.status(201).json(auth)
    })
)


router.post('/refresh', auth, adminAccess,
    trappiner(async (req, res) => {
        const { id } = req.body
        
        const auth = await Access.refresh(req.accessId, id)

        res.status(200).json(auth)
    })
)

// Only for Develop!!!
router.post('/create-admin', trappiner(async (req, res) => {
    const auth = await Access.create('Initial')
 
    res.status(201).json(auth)
})) 


module.exports = router