# Stats API

Little stats counters for [my about page](https://lowmess.com/about)

This project was created with [Apollo Launchpad](https://launchpad.graphql.com)

You can see the original pad at [https://launchpad.graphql.com/37p7j0nxlv](https://launchpad.graphql.com/37p7j0nxlv)

### Quick start guide

```bash
npm install
npm start
```

### App secrets

This pad contains some secret keys which you will need to provide as environment variables. Use `dotenv` to do that in development, and `now` secrets to do it in production.

Here's the keys you need:

* `APOLLO_KEY` - Apollo Engine API key
* `GITHUB_KEY` - GitHub personal access token
* `GITHUB_ID` - GitHub user ID to find commits for
* `LASTFM_KEY` - Last.fm oauth token
* `LASTFM_USERNAME` - Last.fm username to look up
* `FITBIT_KEY` - Fitbit oauth token
* `GOODREADS_KEY` - Goodreads API key
* `GOODREADS_ID` - Goodreads user id to look up
* `FOURSQUARE_KEY` - Foursquare oauth token
