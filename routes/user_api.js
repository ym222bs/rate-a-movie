'use strict'

const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken')
const User = require('../model/user')
const auth = require('../auth/authenticate')
const validateToken = require('../auth/validate_token')

/*  
    - Content of user api

    - Get all users     - No auth
    - Create a user     - No auth
    - Login a user      - No auth
    - Delete a user     - Auth needed
    - Change user info  - Auth needed
    
*/

router.get('/users', async (req, res, next) => {
    try {
        const users = await User.find({}).select('username createdAt')

        const context = {
            users: users.map((user) => {
                return {
                    id: user._id,
                    username: user.username,
                    createdAt: user.createdAt,
                    request: {
                        url: `https://${req.headers.host}/user/${user._id}`,
                        methods: 'GET, PUT, DELETE',
                        requirements:
                            'Methods PUT and DELETE requires Autentication by a token.',
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

// -- Get a specific user.
router.get('/user/:id', async (req, res, next) => {
    try {
        const id = req.params.id
        const user = await User.findById(id).select('username createdAt')

        res.status(200).json({
            msg: 'User found.',
            user,
            request: {
                url: `https://${req.headers.host}/user/${user._id}`,
                mathods: 'GET, PUT, DELETE',
                requirements:
                    'Methods PUT and DELETE requires Autentication by a token.',
            },
        })
    } catch (err) {
        res.send({
            msg: 'No user with matching id.',
            error: err.message,
        })
        return next(err)
    }
})

// -- Create user.
router.post('/user/register', async (req, res, next) => {
    try {
        const { username, password } = req.body

        const user = new User({
            username,
            password,
        })
        const userss = await user.save()

        const newUser = await User.find({ username }).select(
            'username createdAt'
        )
        res.status(201).json({
            msg: 'User was created successfully',
            newUser,
            requests: {
                home: {
                    url: `https://${req.headers.host}`,
                    method: 'GET',
                },
                user: {
                    url: `https://${req.headers.host}/user/${newUser[0]._id}`,
                    methods: 'PUT, DELETE',
                    requirement: 'Authentication by jwt_token.',
                },
            },
        })
    } catch (err) {
        res.status(409).send({
            msg: 'Something went wrong.',
            error: err.message,
        })
    }
})

// -- Authenticate user.
router.post('/user/login', async (req, res, next) => {
    const { username, password } = req.body
    try {
        const user = await auth.authenticate(username, password)

        await jwt.sign(
            {
                user: user.username,
                id: user._id,
            },
            process.env.JWT_SECRET,
            {
                expiresIn: '3h',
            },
            (err, token) => {
                if (err) {
                    return next(err)
                }

                res.status(200).json({
                    token,
                    username,
                    request: {
                        url: `https://${req.headers.host}/users`,
                        method: 'GET',
                    },
                })
            }
        )
    } catch (err) {
        res.status(400).send({
            msg: 'Login failed.',
            error: err.message,
        })
        return next(err)
    }
})

// -- Update user.
// -- Auth
router.put('/user/:id', validateToken, async (req, res, next) => {
    try {
        // Validating if user is owner to change the data
        if (req.params.id !== req.userID) {
            res.status(403).json({
                msg: 'Forbidden.',
            })
            return
        } else {
            await User.findOneAndUpdate({ _id: req.params.id }, req.body)
            const updatedUser = await User.findById({ _id: req.params.id })
            res.status(200).json({
                msg: 'User information updated successfully.',
                updatedUser,
                request: {
                    url: `https://${req.headers.host}/users`,
                    method: 'GET',
                },
            })
        }
    } catch (err) {
        res.send({
            msg: 'Could not update user.',
            error: err.message,
        })
        return next(err)
    }
})

// -- Delete user.
// -- Auth
router.delete('/user/:id', validateToken, async (req, res, next) => {
    try {
        if (req.params.id !== req.userID) {
            res.status(403).json({
                msg: 'Forbidden.',
            })
            return
        }

        await User.findOneAndRemove({ _id: req.params.id })
        res.status(200).send({
            msg: 'User was deleted.',
            request: {
                url: `https://${req.headers.host}/users`,
                method: 'GET',
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
