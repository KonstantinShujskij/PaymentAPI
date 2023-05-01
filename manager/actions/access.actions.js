const types = require('../types/access.types')

const create = (access, accessList) => {
    return {
        type: types.CREATE,
        payload: {
            id: access._id,
            name: access.name,
            accessList
        }
    }
}

const setCourse = (access) => {
    return {
        type: types.SET_COURSE,
        payload: {
            id: access._id,
            name: access.name,
            course: access.course
        }
    }
}

module.exports = {
    create,
    setCourse    
}