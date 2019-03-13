const express = require('express')
const cors = require('cors')
const { ApolloServer } = require('apollo-server-express')
const { typeDefs, resolvers } = require('./schema')

// Check for secrets
if (typeof process.env.GITHUB_KEY === 'undefined') {
  console.warn(
    'WARNING: process.env.GITHUB_KEY is not defined. Check README.md for more information'
  )
}
if (typeof process.env.GITHUB_ID === 'undefined') {
  console.warn(
    'WARNING: process.env.GITHUB_ID is not defined. Check README.md for more information'
  )
}
if (typeof process.env.LASTFM_KEY === 'undefined') {
  console.warn(
    'WARNING: process.env.LASTFM_KEY is not defined. Check README.md for more information'
  )
}
if (typeof process.env.LASTFM_USERNAME === 'undefined') {
  console.warn(
    'WARNING: process.env.LASTFM_USERNAME is not defined. Check README.md for more information'
  )
}
if (typeof process.env.FITBIT_KEY === 'undefined') {
  console.warn(
    'WARNING: process.env.FITBIT_KEY is not defined. Check README.md for more information'
  )
}
if (typeof process.env.GOODREADS_KEY === 'undefined') {
  console.warn(
    'WARNING: process.env.GOODREADS_KEY is not defined. Check README.md for more information'
  )
}
if (typeof process.env.GOODREADS_ID === 'undefined') {
  console.warn(
    'WARNING: process.env.GOODREADS_ID is not defined. Check README.md for more information'
  )
}
if (typeof process.env.FOURSQUARE_KEY === 'undefined') {
  console.warn(
    'WARNING: process.env.FOURSQUARE_KEY is not defined. Check README.md for more information'
  )
}

// Set up Express
const app = express()
app.use(cors({ origin: [/lowmess\.com$/, /localhost/] }))

const server = new ApolloServer({ typeDefs, resolvers, cacheControl: true })
server.applyMiddleware({ app })

app.listen()

module.exports = app
