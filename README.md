# Stats API

Little stats counters for [my about page](https://lowmess.com/about/)

### App secrets

This pad contains some secret keys which you will need to provide as environment variables. Use [a `.env` to that locally](https://zeit.co/docs/v2/development/environment-variables/), and [`now` secrets to do it in production](https://zeit.co/docs/v2/deployments/environment-variables-and-secrets/).

Here's the keys you need:

- `ENGINE_API_KEY` - Apollo Engine API key (optional)
- `AWS_ACCESS` - AWS access key ID
- `AWS_SECRET` - AWS secret access key
- `AWS_BUCKET` - Bucket name to find `withings.json` (see below)
- `FOURSQUARE_KEY` - Foursquare OAuth token
- `GITHUB_KEY` - GitHub personal access token
- `GOODREADS_KEY` - Goodreads API key
- `GOODREADS_ID` - Goodreads user ID to look up
- `LASTFM_KEY` - Last.fm OAuth token
- `LASTFM_USERNAME` - Last.fm username to look up
- `TWITTER_KEY` - Twitter OAuth bearer token
- `WITHINGS_CLIENT_ID` - Withings Client ID (for OAuth token refresh)
- `WITHINGS_CLIENT_SECRET` - Withings Client Secret (for OAuth token refresh)

---

** Why do I need AWS credentials?**

Because Withings sucks. Unlike the other services here, the OAuth tokens Withings provides has an exceedingly short lifespan (about 3 hours). This means that we need a way to store and update those tokens more than the occassional redeploy with new keys. If I was developing this from scratch, instead of updating my previous work (the first version of this API used FitBit, but I wanted a nicer watch smh), I would likely just make a full-on server with database instead of this half-serverless thing I've got going on.

Anyways, it's exceedingly important than the provided bucket has a `withings.json` object containing, at minimum, an `access_token` and `refresh_token`.
