'use strict'

const bcrypt = require('bcrypt')
const User = require('../model/user')

exports.authenticate = (username, password) => {
    return new Promise(async (resolve, reject) => {
        try {
            const user = await User.findOne({ username })
            bcrypt.compare(password, user.password, (err, isMatch) => {
                if (err) {
                    return next(err)
                }
                isMatch ? resolve(user) : reject('Login failed.')
            })
        } catch (err) {
            reject('Login failed.')
            throw err
        }
    })
}
