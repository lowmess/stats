const stat = (selector, value) => {
  document.querySelector(`[data-stat=${selector}]`).innerHTML = value
}

const markupBook = ({ name, author }) => `
  <div class="book">
    &ldquo;${name}&rdquo;, ${author}
  </div>
`

const fillBooks = books => {
  const container = document.querySelector('[data-books-container]')
  container.innerHTML = ''

  books.forEach(book => {
    const html = markupBook(book)
    const template = document.createElement('template')
    template.innerHTML = html
    container.appendChild(template.content.firstElementChild)
  })
}

const query = `
  query LocalQuery {
    commits
    tweets
    places
    steps
    songs
    album {
      name
      artist
    }
    books {
      name
      author
    }
  }`

fetch('/graphql', {
  method: 'POST',
  body: JSON.stringify({ query }),
  headers: {
    'Content-Type': 'application/json',
  },
})
  .then(res => res.json())
  .then(json => {
    if (json.data) {
      // Commits
      if (typeof json.data.commits === 'number') {
        stat('commits', json.data.commits.toLocaleString())
      }

      // Tweets
      if (typeof json.data.tweets === 'number') {
        stat('tweets', json.data.tweets.toLocaleString())
      }

      // Places
      if (typeof json.data.places === 'number') {
        stat('places', json.data.places.toLocaleString())
      }

      // Steps
      if (typeof json.data.steps === 'number') {
        stat('steps', json.data.steps.toLocaleString())
      }

      // Songs
      if (typeof json.data.songs === 'number') {
        stat('songs', json.data.songs.toLocaleString())
      }

      // Album
      if (json.data.album) {
        if (json.data.album.name && json.data.album.artist) {
          stat(
            'album',
            `&ldquo;${json.data.album.name}&rdquo;, ${json.data.album.artist}`
          )
        }
      }

      // Book
      if (json.data.books) {
        fillBooks(json.data.books)
      }
    }
  })
  .catch(err => {
    console.error(err)
  })
