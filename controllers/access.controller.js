const Access = require('../models/Access.model')
const dispatch = require('../manager/dispatch')
const actions = require('../manager/actions/access.actions')
const errors = require('../errors')

const jwt = require('jsonwebtoken')
const keyGen = require('generate-key')
const config = require('config')

async function create(accessId, name='Admin', course=40, accessList={admin: true}) {
    const access = new Access()
    const id = access._id

    const secret = config.get('jwtSecret')
    const apiSecret = config.get('apiSecret')
    
    const privateToken = keyGen.generateKey(32).toString()

    const accessToken = jwt.sign({ id, accessList }, secret, { expiresIn: '10000d' })
    const hashedToken = jwt.sign({ privateToken }, apiSecret, { expiresIn: '10000d' })

    access.privateToken = hashedToken
    access.accessToken = accessToken

    access.name = name
    access.course = course

    await access.save()

    dispatch(accessId, actions.create(access, accessList))

    return { accessToken, privateToken }
}

async function setCourse(accessId, id, course) {
    const access = await Access.findOne({ _id: id })
    if(!access) { throw errors.notFind }

    access.course = course

    await access.save()

    dispatch(accessId, actions.setCourse(access))

    return access.course
}

module.exports = { create, setCourse }