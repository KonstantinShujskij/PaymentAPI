const mongoose = require('mongoose')
const express = require('express')
const config = require('config')
const app = express()

const PORT = config.get('port')
const mongoUri = config.get('mongoUri')

app.use(express.json({ extended: true }))

app.use('/api/access', require('./routes/access.routes'))
app.use('/api/maker', require('./routes/maker.routes'))
app.use('/api/taker', require('./routes/taker.routes'))
app.use('/api/order', require('./routes/order.routes'))
app.use('/api/subscribe', require('./routes/subscriber.route'))
app.use('/api/admin', require('./routes/admin.routes'))

//"mongoUri": "mongodb+srv://ncapi:7k9fHS3OM3PErhed@ncapi1.xrfahnk.mongodb.net/?retryWrites=true&w=majority"

async function start() {
    try {
        await mongoose.connect(mongoUri, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })

        app.listen(PORT, () => console.log(`App has been started on port ${PORT}`))
    } catch(error) {
        console.log("Server error: ", error.message)
        process.exit(1)
    }
}

start()