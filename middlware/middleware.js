const errors = require('../errors')

module.exports = (callback) => {
    return async (req, res, next) => {
        if(req.method === 'OPTIONS') { return next() }
    
        try { 
            await callback(req, res)
            next() 
        }
        catch(error) { 
            if(error.custom) { res.status(400).json(error.answer) }
            else { res.status(500).json(errors.unknown.answer) }
        }
    }
}