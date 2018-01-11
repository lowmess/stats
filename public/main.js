const stat = (selector, value) => {
  document.querySelector(`[data-stat=${selector}]`).innerHTML = value
}

const query = `
  query LocalQuery {
    commits
    places
    steps
    sleep
    songs
    album {
      name
      artist
    }
    book {
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
      // Places
      if (json.data.places) stat('places', json.data.places.toLocaleString())
      // Steps
      if (json.data.steps) stat('steps', json.data.steps.toLocaleString())
      // Sleep
      if (json.data.sleep) {
        stat('sleep', parseFloat(json.data.sleep.toFixed(2).toLocaleString()))
      }
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
      if (json.data.book) {
        if (json.data.book.name && json.data.book.author) {
          stat(
            'book',
            `<em>${json.data.book.name}</em>, ${json.data.book.author}`
          )
        }
      }
    }
  })
  .catch(err => {
    console.error(err)
  })
