import fetch, { RequestInit, Response } from 'node-fetch'
import { AbortController } from 'abort-controller'

const fetchWithTimeout = async (
  uri: string,
  options: RequestInit = {},
  time = 5000
): Promise<Response> => {
  const controller = new AbortController()
  const config: RequestInit = { ...options, signal: controller.signal }

  setTimeout(() => {
    controller.abort()
  }, time)

  try {
    const response = await fetch(uri, config)

    if (!response.ok) {
      throw new Error(`${response.status}: ${response.statusText}`)
    }

    return response
  } catch (error) {
    if (error.name === 'AbortError') {
      throw new Error(`Request timed out`)
    }

    throw new Error(error.message)
  }
}

export default fetchWithTimeout
