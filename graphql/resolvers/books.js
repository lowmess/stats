const fetch = require('node-fetch')
const xml2js = require('xml2js')

const getBooks = () =>
  fetch(
    `https://www.goodreads.com/review/list?v=2&id=${
      process.env.GOODREADS_ID
    }&shelf=currently-reading&key=${process.env.GOODREADS_KEY}`
  )
    .then(response => {
      if (!response.ok) {
        throw new Error(`${response.status}: ${response.statusText}`)
      }

      return response.text()
    })
    .then(text => {
      const books = []

      xml2js.parseString(text, { normalizeTags: true }, (error, result) => {
        if (error) {
          throw new Error(error.message ? error.message : error)
        }

        if (!result.goodreadsresponse) {
          throw new Error(`Goodreads responded without a response object`)
        }

        result.goodreadsresponse.reviews[0].review.forEach(book => {
          const name = book.book[0].title[0]
          const author = book.book[0].authors[0].author[0].name[0]
          books.push({ name, author })
        })
      })

      return books
    })
    .catch(error => {
      throw new Error(error.message ? error.message : error)
    })

module.exports = getBooks
