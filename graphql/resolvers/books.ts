import fetch from '../lib/fetchWithTimeout'
import xml2js from 'xml2js'

interface Book {
  readonly name: string
  readonly author: string
}

const getBooks = async (): Promise<Book[]> => {
  const uri = `https://www.goodreads.com/review/list?v=2&id=${process.env.GOODREADS_ID}&shelf=currently-reading&key=${process.env.GOODREADS_KEY}`

  const response = await fetch(uri)
  const data = await response.text()

  const books: Book[] = []

  xml2js.parseString(data, { normalizeTags: true }, (error, result) => {
    if (error) {
      throw new Error(error.message)
    }

    if (!result.goodreadsresponse) {
      throw new Error(`Goodreads responded without a response object`)
    }

    // explicitly setting book to any here, because I don't want to type out
    // this insanely bullshit format that `xml2js` spits out. fuckin goodreads
    result.goodreadsresponse.reviews[0].review.forEach((book: any) => {
      const name = book.book[0].title[0]
      const author = book.book[0].authors[0].author[0].name[0]
      books.push({ name, author })
    })
  })

  return books
}

export default getBooks
