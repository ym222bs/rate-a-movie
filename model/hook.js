const mongoose = require('mongoose')

const hookSchema = new mongoose.Schema({
    url: {
        type: String,
        match: /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,4}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/,
        required: true,
    },
    username: {
        type: String,
    },
    user_id: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
})

const Hook = mongoose.model('hook_information', hookSchema)

module.exports = Hook
