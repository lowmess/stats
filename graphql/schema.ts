/* eslint-disable no-shadow */

import { gql } from 'apollo-server-express'
import getCommits from './resolvers/commits'
import getTweets from './resolvers/tweets'
import getPlaces from './resolvers/places'
import getSteps from './resolvers/steps'
import getSongs from './resolvers/songs'
import getAlbum, { AlbumInfo } from './resolvers/album'
import getBooks, { Book } from './resolvers/books'

// Construct a schema, using GraphQL schema language
const typeDefs = gql`
  type Album {
    name: String
    artist: String
  }

  type Book {
    name: String
    author: String
  }

  type Query {
    commits: Int @cacheControl(maxAge: 3600)
    tweets: Int @cacheControl(maxAge: 3600)
    places: Int @cacheControl(maxAge: 86400)
    steps: Int @cacheControl(maxAge: 3600)
    songs: Int @cacheControl(maxAge: 3600)
    album: Album @cacheControl(maxAge: 3600)
    books: [Book] @cacheControl(maxAge: 86400)
  }
`

// Provide resolver functions for your schema fields
const resolvers = {
  Query: {
    // GitHub Commits
    commits: async (): Promise<number> => {
      try {
        const commits = await getCommits()
        return commits
      } catch (error) {
        console.error(error.message ? error.message : error)
        return null
      }
    },
    // Tweets
    tweets: async (): Promise<number> => {
      try {
        const tweets = await getTweets()
        return tweets
      } catch (error) {
        console.error(error.message ? error.message : error)
        return null
      }
    },
    // Foursquare places
    places: async (): Promise<number> => {
      try {
        const places = await getPlaces()
        return places
      } catch (error) {
        console.error(error.message ? error.message : error)
        return null
      }
    },
    // FitBit steps & hours slept
    steps: async (): Promise<number> => {
      try {
        const steps = await getSteps()
        return steps
      } catch (error) {
        console.error(error.message ? error.message : error)
        return null
      }
    },
    // Last.fm top album & total songs
    songs: async (): Promise<number> => {
      try {
        const songs = await getSongs()
        return songs
      } catch (error) {
        console.error(error.message ? error.message : error)
        return null
      }
    },
    album: async (): Promise<AlbumInfo> => {
      try {
        const album = await getAlbum()
        return album
      } catch (error) {
        console.error(error.message ? error.message : error)
        return null
      }
    },
    // Goodreads book
    books: async (): Promise<Book[]> => {
      try {
        const books = await getBooks()
        return books
      } catch (error) {
        console.error(error.message ? error.message : error)
        return null
      }
    },
  },
}

export { typeDefs, resolvers }
