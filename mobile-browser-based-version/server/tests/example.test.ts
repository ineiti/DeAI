// eslint-disable-next-line no-unused-vars
// import * as tf from '@tensorflow/tfjs'

// import fetch from 'node-fetch'
import 'jest'

/**
 * Code breaks if we uncomment import and fetch due to ESM transformers.
 */

function add (x, y) {
  // console.log(tf.tensor(x))
  // fetch('hi')
  return x + y
}

describe('test add function', () => {
  it('should return 15 for add(10,5)', () => {
    expect(add(10, 5)).toBe(15)
  }); it('should return 5 for add(2,3)', () => {
    expect(add(2, 3)).toBe(5)
  })
})

// import * as api from '../src/test/api'

// describe('test api', () => {
//   it('connect should return ok', async () => {
//     api.connect('titanic', 0).then(resp =>
//       expect(resp.ok).toBe(true)
//     )
//   })
// })
