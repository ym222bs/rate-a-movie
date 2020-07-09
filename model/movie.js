const mongoose = require('mongoose')

const movieSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    genre: {
        type: String,
        required: true,
    },
    year: {
        type: Number,
        required: true,
    },
    ratings: {
        type: Number,
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

const Movie = mongoose.model('movie_information', movieSchema)

module.exports = Movie
