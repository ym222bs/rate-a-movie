'use strict'

const fetch = require('node-fetch')

// Curry: (m) => (p) => {}

module.exports = (movie) => (hook) => {
    return fetch(hook.url, {
        method: 'POST',
        body: JSON.stringify(movie),
        headers: {
            'Content-Type': 'application/json',
        },
    })
}
