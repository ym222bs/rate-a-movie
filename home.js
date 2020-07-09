'use strict'

exports.homeJSON = (req, res, next) => {
    res.json({
        home: {
            main: {
                name: 'Rate-A-Movie-RestApi',
                description:
                    "Movie-restapi makes it possible for authenticated users to add and rate watched movies, and sign up endpoint url's to receive freshly added movies.",
                host: `https://${req.headers.host}`,
            },
            links: {
                user: {
                    list_users: {
                        url: `https://${req.headers.host}/users`,
                        method: 'GET',
                    },
                    register_user: {
                        url: `https://${req.headers.host}/user/register`,
                        method: 'POST',
                        parameter_1: 'username:choose_username',
                        parameter_2: 'password:choose_password',
                        headers: 'Content-Type : application/json',
                    },
                    login_user: {
                        url: `https://${req.headers.host}/user/login`,
                        method: 'POST',
                        parameter_1: 'username:your_username',
                        parameter_2: 'password:your_password',
                        headers: 'Content-Type : application/json',
                        return: 'jwt_token',
                        instruction:
                            'Use your unique and private jwt_token to autenticate where it is required.',
                    },
                    requires_authentication: {
                        update_user: {
                            url: `https://${req.headers.host}/user/:id`,
                            method: 'PUT',
                            headers:
                                'Content-Type : application/json | Authorization : Bearer {jwt_token}',
                        },
                        delete_user: {
                            url: `https://${req.headers.host}/user/:id`,
                            method: 'DELETE',
                            headers: 'Authorization : Bearer {jwt_token}',
                        },
                    },
                },
                movie: {
                    list_movies: {
                        url: `https://${req.headers.host}/movies`,
                        method: 'GET',
                    },
                    requires_authentication: {
                        add_movie: {
                            url: `https://${req.headers.host}/movie`,
                            method: 'POST',
                            parameter_1: 'title:movie_title',
                            parameter_2: 'genre:movie_genre',
                            parameter_3: 'year:releas_year',
                            parameter_4: 'ratings:your_ratings',
                            headers:
                                'Content-Type : application/json | Authorization : Bearer {jwt_token}',
                        },
                        update_movie: {
                            url: `https://${req.headers.host}/movie/:id`,
                            method: 'PUT',
                            headers:
                                'Content-Type : application/json | Authorization : Bearer {jwt_token}',
                        },
                        delete_movie: {
                            url: `https://${req.headers.host}/movie/:id`,
                            method: 'DELETE',
                            headers: ' Authorization : Bearer {jwt_token}',
                        },
                    },
                },
                hook: {
                    list_all_hooks: {
                        url: `https://${req.headers.host}/webhooks`,
                        method: 'GET',
                    },
                    requires_authentication: {
                        add_hook: {
                            url: `https://${req.headers.host}/webhook`,
                            method: 'POST',
                            parameter_1: 'url:your_payload_url',
                            headers:
                                'Content-Type : application/json | Authorization : Bearer {jwt_token}',
                        },
                        delete_hook: {
                            url: `https://${req.headers.host}/webhook/:id`,
                            method: 'DELETE',
                            headers: ' Authorization : Bearer {jwt_token}',
                        },
                    },
                },
            },
        },
    })
    next()
}
