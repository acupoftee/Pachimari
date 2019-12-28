'use strict'

// creating a base name for the mongodb
const mongooseBaseName = 'pachimari'

// create the mongodb uri for development and test
const dev = `mongodb://localhost:27017/${mongooseBaseName}`

// Environment variable MONGODB_URI will be available in
// heroku production evironment otherwise use development db
const currentDb = process.env.MONGODB_URI || dev

module.exports = currentDb
