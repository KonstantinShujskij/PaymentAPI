const { createHmac } = require('node:crypto')
const Access = require('../models/Access.model')
const middleware = require('./middleware')
const errors = require('../errors')
const jwt = require('jsonwebtoken')
const config = require('config')


const auth = middleware(async (req, res) => {
    const { accessToken, signature } = req.body

    const secret = config.get('jwtSecret')
    const apiSecret = config.get('apiSecret')

    const { id, accessList } = jwt.verify(accessToken, secret)

    const access = await Access.findOne({ _id: id })
    if(!access) { throw errors.notAuth }

    const { privateToken } = jwt.verify(access.privateToken, apiSecret)

    const data = JSON.parse(JSON.stringify(req.body))
    delete data.signature

    const json = JSON.stringify(data)
    const hash = createHmac('sha256', privateToken).update(json).digest('hex')

    const isMatch = (hash === signature)
    if(!isMatch) { throw errors.notAuth }

    req.accessId = access._id
    req.access = accessList
})

const adminAccess = middleware(async (req, res) => { if(!req.access.admin) { throw errors.notAccess } })
const makeAccess = middleware(async (req, res) => { if(!req.access.make) { throw errors.notAccess } })
const takeAccess = middleware(async (req, res) => { if(!req.access.take) { throw errors.notAccess } })

module.exports = { auth, makeAccess, takeAccess, adminAccess }