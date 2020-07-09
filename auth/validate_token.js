'use strict'

const jwt = require('jsonwebtoken')

module.exports = async (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1]
        const verified = await jwt.verify(token, process.env.JWT_SECRET)
        req.userName = verified.user
        req.userID = verified.id
        next()
    } catch (err) {
        res.status(401).send({
            msg: 'Login failed.',
        })
    }
}
