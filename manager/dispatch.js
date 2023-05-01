const Action = require('../models/Action.model')
const { listen } = require('../controllers/subscriber.controller')

module.exports = async (initializer, action) => {
    const act = new Action({initializer, ...action})
    await act.save()

    listen(action).then()
}