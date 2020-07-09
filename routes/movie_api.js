'use strict'

const express = require('express')
const router = express.Router()
const Movie = require('../model/movie')
const Hook = require('../model/hook')
const mongoose = require('mongoose')
const notifyHook = require('../notify_hook')
const validateToken = require('../auth/validate_token')

/*
    - List all movies   - No auth
    - Add movie         - Auth needed
    - Update movie      - Auth needed
    - Delete movie      - Auth needed

*/

// -- List all movies.
router.get('/movies', async (req, res, next) => {
    try {
        const movies = await Movie.find({}).select(
            '_id title genre year ratings username'
        )

        const context = {
            movies: movies.map((movie) => {
                return {
                    id: movie._id,
                    title: movie.title,
                    genre: movie.genre,
                    year: movie.year,
                    ratings: movie.ratings,
                    username: movie.username,
                    request: {
                        url: `https://${req.headers.host}/movie/${movie._id}`,
                        methods: 'GET, PUT, DELETE',
                        requirements:
                            'Methods PUT and DELETE requires Authentication by a token.',
                    },
                }
            }),
        }
        res.status(200).json({
            context,
        })
    } catch (err) {
        res.send({
            msg: 'Something went wrong.',
            error: err.message,
        })
        return next(err)
    }
})

// -- List movies by id.
router.get('/movie/:id', async (req, res, next) => {
    try {
        const id = req.params.id
        const movie = await Movie.findById(id).select(
            '_id title genre year ratings'
        )

        res.status(200).json({
            movie,
            request: {
                requirement: 'Authentication by jwt_token.',
                url: `https://${req.headers.host}/movie/${id}`,
                methods: 'PUT, DELETE',
            },
        })
    } catch (err) {
        res.send({
            msg: 'Something went wrong.',
            error: err.message,
        })
        return next(err)
    }
})

// -- Add movie.
// -- Auth
router.post('/movie', validateToken, async (req, res, next) => {
    const username = req.userName
    const user_id = req.userID

    const { title, genre, year, ratings } = req.body
    const movie = new Movie({
        title,
        genre,
        year,
        ratings,
        username,
        user_id,
    })
    try {
        const newMovie = await movie.save()
        const hooks = (await Hook.find({})).map(notifyHook(movie))

        res.status(201).send({
            msg: 'Movie saved.',
            newMovie,
            requests: {
                movies: {
                    url_list_all_movies: `https://${req.headers.host}/movies`,
                    method: 'GET',
                },
                movie: {
                    url: `https://${req.headers.host}/movie/:id`,
                    methods: 'PUT, DELETE',
                    requirement: 'Authentication by jwt_token.',
                },
            },
        })
    } catch (err) {
        res.send({
            msg: 'Could not save movie.',
            error: err.message,
        })
        return next(err)
    }
})

// -- Update movie.
// -- Auth
router.put('/movie/:id', validateToken, async (req, res, next) => {
    try {
        const chosenMovie = await Movie.findById({ _id: req.params.id })
        // Validating if user is owner to change the data
        if (req.userID !== chosenMovie.user_id) {
            res.status(403).json({
                msg: 'Forbidden.',
            })
            return
        }
        const movie = await Movie.findOneAndUpdate(
            { _id: req.params.id },
            req.body
        )
        const updatedMovie = await Movie.findById({ _id: req.params.id })

        res.status(200).json({
            msg: 'Movie information updated successfully.',
            updatedMovie,
            requests: {
                home: {
                    url: `https://${req.headers.host}`,
                    methods: 'GET',
                },
                movies: {
                    url: `https://${req.headers.host}/movies`,
                    methods: 'GET',
                },
            },
        })
    } catch (err) {
        res.send({
            msg: 'Could not update movie.',
            error: err.message,
        })
        return next(err)
    }
})

// -- Delete movie.
// -- Auth
router.delete('/movie/:id', validateToken, async (req, res, next) => {
    try {
        const chosenMovie = await Movie.findById({ _id: req.params.id })
        // Validating if user is owner to change the data
        if (req.userID !== chosenMovie.user_id) {
            res.status(403).json({
                msg: 'Forbidden.',
                error: err.message,
            })
            return next(err)
        }

        const movie = await Movie.findOneAndRemove({ _id: req.params.id })
        res.status(200).send({
            msg: 'Movie deleted.',
            movie: req.body,
            requests: {
                home: {
                    url: `https://${req.headers.host}`,
                    methods: 'GET',
                },
                movies: {
                    url: `https://${req.headers.host}/movies`,
                    methods: 'GET',
                },
            },
        })
    } catch (err) {
        res.send({
            msg: 'No user id match.',
            error: err.message,
        })
        return next(err)
    }
})

module.exports = router
