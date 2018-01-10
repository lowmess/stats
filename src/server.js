import express from 'express'
import cors from 'cors'
import compression from 'compression'
import { Engine } from 'apollo-engine'
import { graphqlExpress, graphiqlExpress } from 'apollo-server-express'
import bodyParser from 'body-parser'
import dotenv from 'dotenv'

dotenv.config()

import * as Schema from './schema'

const PORT = 3000
const server = express()

const engine = new Engine({
  engineConfig: {
    apiKey: process.env.APOLLO_KEY,
    stores: [
      {
        name: 'publicResponseCache',
        inMemory: {
          cacheSize: 10485760,
        },
      },
    ],
    queryCache: {
      publicFullQueryStore: 'publicResponseCache',
    },
  },
  graphqlPort: process.env.PORT || PORT,
})

engine.start()
server.use(cors())
server.use(compression())
server.use(engine.expressMiddleware())

if (typeof process.env.GITHUB_KEY === 'undefined') {
  console.warn(
    'WARNING: process.env.GITHUB_KEY is not defined. Check README.md for more information'
  )
}
if (typeof process.env.LASTFM_KEY === 'undefined') {
  console.warn(
    'WARNING: process.env.LASTFM_KEY is not defined. Check README.md for more information'
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
if (typeof process.env.GITHUB_NAME === 'undefined') {
  console.warn(
    'WARNING: process.env.GITHUB_NAME is not defined. Check README.md for more information'
  )
}

const schemaFunction =
  Schema.schemaFunction ||
  function() {
    return Schema.schema
  }
let schema
const rootFunction =
  Schema.rootFunction ||
  function() {
    return schema.rootValue
  }
const contextFunction =
  Schema.context ||
  function(headers, secrets) {
    return Object.assign(
      {
        headers: headers,
      },
      secrets
    )
  }

server.use(
  '/graphql',
  bodyParser.json(),
  graphqlExpress(async request => {
    if (!schema) {
      schema = schemaFunction(process.env)
    }
    const context = await contextFunction(request.headers, process.env)
    const rootValue = await rootFunction(request.headers, process.env)

    return {
      schema: await schema,
      rootValue,
      context,
      tracing: true,
      cacheControl: true,
    }
  })
)

server.use(
  '/graphiql',
  graphiqlExpress({
    endpointURL: '/graphql',
    query: ``,
  })
)

server.listen(PORT, () => {
  console.log(
    `GraphQL Server is now running on http://localhost:${PORT}/graphql`
  )
  console.log(`View GraphiQL at http://localhost:${PORT}/graphiql`)
})
