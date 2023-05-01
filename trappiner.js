const { validationResult } = require('express-validator')
const errors = require('./errors')

const trappiner = (handler) => {
    return async (req, res) => {
        try { 
            const error = validationResult(req).array().pop()
            if(error) { throw errors[error.msg] }

            await handler(req, res) 
        } 
        catch(error) {
            if(error.custom) { res.status(400).json(error.answer) }
            else { res.status(500).json(errors.unknown.answer) }
        }
    }
}

module.exports = trappiner