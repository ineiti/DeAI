/* eslint-disable no-unused-expressions */
import { expect } from 'chai'
import 'mocha'
import 'node-fetch'

import * as feaiAPI from '../../src/helpers/communication/federated/api'

// During the test the env variable is set to test
// But why?
process.env.NODE_ENV = 'test'

describe('Options tests', function () { // the tests container
  it('checking default ', async function () { // the single test
    const req = await feaiAPI.connect('titanic', '114')
    expect(req.ok).to.be.true
  })
})
