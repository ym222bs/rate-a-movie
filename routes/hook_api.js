'use strict'

const express = require('express')
const router = express.Router()
const Hook = require('../model/hook')
const validateToken = require('../auth/validate_token')

/*
    - List all hookURL's     - No auth
    - Add hook               - Auth needed
    - Delete hook            - Auth needed

*/

// -- List all hooks.
router.get('/webhooks', async (req, res, next) => {
    try {
        const hooks = await Hook.find({}).select('url username createdAt')

        const context = {
            webhooks: hooks.map((hook) => {
                return {
                    id: hook._id,
                    url: hook.url,
                    username: hook.username,
                    createdAt: hook.createdAt,
                    request: {
                        url: `https://${req.headers.host}/webhook/${hook._id}`,
                        methods: 'GET, POST, DELETE',
                        requirements:
                            'Methods POST and DELETE requires Autentication by a token.',
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
// -- Create a hook.
// -- Auth
router.post('/webhook', validateToken, async (req, res, next) => {
    const username = req.userName
    const user_id = req.userID
    const url = req.body.url

    const hook = new Hook({
        url,
        username,
        user_id,
    })
    try {
        const newHook = await hook.save()
        res.status(201).send({
            msg: 'Webhook url saved.',
            hook,
            request: {
                url_home: `https://${req.headers.host}`,
                method: 'GET',
            },
        })
    } catch (err) {
        res.send({
            msg: 'Not a valid url or url missing.',
            error: err.message,
        })
        next(err)
    }
})

// -- Delete a hook.
// -- Auth
router.delete('/webhook/:id', validateToken, async (req, res, next) => {
    const url = req.body.url
    if (req.params.id !== req.userID) {
        res.status(403).json({
            msg: 'Forbidden.',
        })
        return
    }
    try {
        await Hook.findOneAndRemove({ _id: req.params.id })
        res.status(200).send({
            msg: 'Webhook was deleted.',
            request: {
                home: {
                    url_home: `https://${req.headers.host}`,
                    method: 'GET',
                },
                add_webhook: {
                    url_add_hook: `https://${req.headers.host}/webhook`,
                    method: 'POST',
                    requirement: 'Authentication by jwt_token.',
                },
            },
        })
    } catch (err) {
        res.send({
            msg: 'Not a valid id or id missing.',
            error: err.message,
        })
        next(err)
    }
})

module.exports = router
