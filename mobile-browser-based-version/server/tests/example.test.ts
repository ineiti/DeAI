
// eslint-disable-next-line no-unused-vars
// import fetch from 'node-fetch'

/**
 * Code breaks if we uncomment import and fetch due to ESM transformers.
 */

function add (x, y) {
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
