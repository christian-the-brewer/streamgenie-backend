//IMPORT NPM PACKAGES
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')

//IMPORT ROUTES
const userRoutes = require('./app/routes/user_routes')
const favoritesRoutes = require('./favoritesRoutes')

//IMPORT MIDDLEWARE
const errorHandler = require('./lib/error_handler')
const replaceToken = require('./lib/replace_token')
const requestLogger = require('./lib/request_logger')

// IMPORT DATABASE CONFIG
// `db` is the Mongo URI as string
const db = require('./config/db')

// require configured passport authentication middleware
const auth = require('./lib/auth')

// server and client port definitions
// used for cors and local port declaration
const serverDevPort = 8000
const clientDevPort = 3000

// connect to database
// use new version of URL parser
mongoose.connect(db, {
    useNewUrlParser: true,
})

// instantiate express application object
const app = express()

// set CORS headers on response from this API using the `cors` NPM package
// `CLIENT_ORIGIN` is an environment variable that will be set on Heroku
app.use(
    cors({
        origin: process.env.CLIENT_ORIGIN || `http://localhost:${clientDevPort}`,
    })
)

// define port for API to run on
// adding PORT= to your env file will be necessary for deployment
const port = process.env.PORT || serverDevPort

// this middleware makes it so the client can use the Rails convention
// of `Authorization: Token token=<token>` OR the Express convention of
// `Authorization: Bearer <token>`
app.use(replaceToken)

// register passport authentication middleware
app.use(auth)

// add `express.json` middleware which will parse JSON requests into
// JS objects before they reach the route files.
// The method `.use` sets up middleware for the Express application
app.use(express.json())
// this parses requests sent by `$.ajax`, which use a different content type
app.use(express.urlencoded({ extended: true }))

// log each request as it comes in for debugging
app.use(requestLogger)

// register route files
app.use(userRoutes)
app.use(favoritesRoutes)

// register error handling middleware
// note that this comes after the route middlewares, because it needs to be
// passed any error messages from them
app.use(errorHandler)

// run API on designated port (4741 in this case)
app.listen(port || 3000, () => {
    console.log('listening on port ' + port)
})

// needed for testing
module.exports = app