const Access = require('../models/Access.model')
const dispatch = require('../manager/dispatch')
const actions = require('../manager/actions/access.actions')
const errors = require('../errors')

const jwt = require('jsonwebtoken')
const keyGen = require('generate-key')
const config = require('config')

function createAuth(id, accessList) {
    const secret = config.get('jwtSecret')
    const apiSecret = config.get('apiSecret')
    
    const privateToken = keyGen.generateKey(32).toString()

    const accessToken = jwt.sign({ id, accessList }, secret, { expiresIn: '10000d' })
    const hashedToken = jwt.sign({ privateToken }, apiSecret, { expiresIn: '10000d' })

    return {
        privateToken,
        accessToken,
        hashedToken
    }
}

async function create(accessId, name='Admin', course=40, min=0, max=1000000, accessList={admin: true}) {
    const access = new Access()
    const id = access._id

    const { privateToken, accessToken, hashedToken } = createAuth(id, accessList)

    access.privateToken = hashedToken
    access.accessToken = accessToken

    access.name = name
    access.course = course
    access.min = min
    access.max = max

    await access.save()

    dispatch(accessId, actions.create(access, accessList))

    return { id: access._id, accessToken, privateToken }
}

async function refresh(accessId, id) {
    const access = await Access.findOne({ _id: id })
    if(!access) { throw errors.notFind }

    const secret = config.get('jwtSecret')
    const decoded = jwt.verify(access.accessToken, secret)

    const accessList = decoded.accessList

    const { privateToken, accessToken, hashedToken } = createAuth(id, accessList)

    access.privateToken = hashedToken
    access.accessToken = accessToken

    await access.save()

    // dispatch(accessId, actions.create(access, accessList)) need make action refresh

    return { accessToken, privateToken }
}

async function setCourse(accessId, id, course) {
    const access = await Access.findOne({ _id: id })
    if(!access) { throw errors.notFind }

    access.course = course

    await access.save()

    dispatch(accessId, actions.setCourse(access))

    return {
        id: access._id,
        name: access.name,
        course: access.course
    }
}

async function getPartners() {
    const secret = config.get('jwtSecret')
    const accessList = await Access.find()

    partners = []

    accessList.forEach((access) => {
        const decoded = jwt.verify(access.accessToken, secret)

        if(decoded.accessList?.make) { 
            partners.push({
                id: access._id,
                name: access.name,
                course: access.course
            })
        } 
    })

    return partners
}

module.exports = { create, refresh, setCourse, getPartners }