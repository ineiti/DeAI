export function craftPostRequest (property, value) {
  const body = {}
  body[property] = value
  return {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  }
}

/**
 * Tries to fetch a resource with the given request function until successful.
 * Limited to a number of tries.
 * @param {Function} request The request's function.
 * @param {Number} tries The number of tries.
 * @param {Number} time Time between tries.
 * @param {any} args Arguments passed to the request's function.
 * @returns The successful response.
 * @throws An error if a successful response could not be obtained
 * after the specified number of tries.
 */
export function getSuccessfulResponse (request, property, tries, time, ...args) {
  return new Promise((resolve) => {
    async function _tryRequest (triesLeft) {
      if (triesLeft <= 0) {
        return resolve(false)
      }
      const response = await request(...args)
      if (response.ok) {
        const body = await response.json()
        if (body[property] > 0) {
          return resolve(body)
        }
      }
      /**
       * If the client disconnected, interrupt the process.
       */
      if (response.status === 401) {
        return resolve(false)
      }
      /**
       * Wait before performing the request again.
       */
      setTimeout(() => _tryRequest(triesLeft - 1), time)
    }
    _tryRequest(tries)
  })
}
