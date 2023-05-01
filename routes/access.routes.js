const {Router} = require('express')
const { auth, adminAccess } = require('../middlware/access.middleware')
const Access = require('../controllers/access.controller')
const { check } = require('express-validator')
const trappiner = require('../trappiner')

const router = Router()

router.post('/create', auth, adminAccess,
    [ 
        check('name', 'wrongData').isString(),
        check('course', 'wrongData').isInt({ min: 0 }),
    ],
    trappiner(async (req, res) => {
        const { name, course, access } = req.body
        const { admin, take, make } = access || {}
        const accessList = { admin: !!admin, take: !!take, make: !!make }
        
        const auth = await Access.create(req.accessId, name, course, accessList)

        res.status(201).json(auth)
    })
)

// Only for Develop!!!
router.post('/create-admin', trappiner(async (req, res) => {
    const auth = await Access.create('Initial')
 
    res.status(201).json(auth)
})) 


module.exports = router