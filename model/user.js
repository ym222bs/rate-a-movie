const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const saltRounds = 10

mongoose.set('useCreateIndex', true)

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        match: /^[a-zA-Z0-9\s]+$/,
    },
    password: {
        type: String,
        required: true,
        trim: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
})

userSchema.pre('findOneAndUpdate', function (next) {
    this.options.runValidators = true
    next()
})

userSchema.pre('save', function (next) {
    this.password = bcrypt.hashSync(this.password, saltRounds)
    next()
})

userSchema.methods.comparePassword = function (candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.password, function (err, isMatch) {
        if (err) return cb(err)
        cb(null, isMatch)
    })
}

const User = mongoose.model('user_information', userSchema)

module.exports = User
