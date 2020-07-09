'use strict'

require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const morgan = require('morgan')
const home = require('./home')
const app = express()

app.use(morgan('combined'))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use((err, req, res, next) => {
    res.status(err.status || 500)
    res.render('error', {
        message: err.message,
        error: {},
    })
})
app.disable('x-powered-by')
// --  setup
const PORT = process.env.PORT || 8080

app.listen(PORT, () => {
    console.log('- Listening to port', PORT)
    mongoose.connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useFindAndModify: false,
    })
})
app.set('json spaces', 4)
app.get('/', home.homeJSON)

// -- Database setup
const db = mongoose.connection

db.on('error', (err) => next(err))
db.once('open', () => {
    console.log('- Database running')
})

app.use('/', require('./routes/user_api'))
app.use('/', require('./routes/movie_api'))
app.use('/', require('./routes/hook_api'))
