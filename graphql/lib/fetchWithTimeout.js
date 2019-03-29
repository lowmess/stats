const fetch = require('node-fetch')
const AbortController = require('abort-controller')

// shim Promise.finally for Node 8
require('promise.prototype.finally').shim()

const fetchWithTimeout = (uri, options, cb, type = 'json', time = 5000) => {
  const controller = new AbortController()
  const timeout = setTimeout(() => {
    controller.abort()
  }, time)
  const config = { ...options, signal: controller.signal }

  return fetch(uri, config)
    .then(response => {
      if (!response.ok) {
        throw new Error(`${response.status}: ${response.statusText}`)
      }

      return cb(response)
    })
    .catch(error => {
      if (error.name === 'AbortError') {
        throw new Error(`Request timed out`)
      }

      throw new Error(error.message ? error.message : error)
    })
    .finally(() => {
      clearTimeout(timeout)
    })
}

module.exports = fetchWithTimeout
