const stat = (selector, value) => {
  document.querySelector(`[data-stat=${selector}]`).innerHTML = value
}

const markupBook = ({ name, author }) => `
  <div class="mb2">
    <span class="f5 f4-ns monospace"><em>${name}</em>, ${author}</span>
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
      if (json.data.commits) stat('commits', json.data.commits.toLocaleString())
      // Tweets
      if (json.data.tweets) stat('tweets', json.data.tweets.toLocaleString())
      // Places
      if (json.data.places) stat('places', json.data.places.toLocaleString())
      // Steps
      if (json.data.steps) stat('steps', json.data.steps.toLocaleString())
      // Songs
      if (json.data.songs) stat('songs', json.data.songs.toLocaleString())
      // Album
      if (json.data.album) {
        if (json.data.album.name && json.data.album.artist) {
          stat(
            'album',
            `<em>${json.data.album.name}</em>, ${json.data.album.artist}`
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
