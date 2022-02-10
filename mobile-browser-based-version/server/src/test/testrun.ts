import * as tf from '@tensorflow/tfjs'

// Working - no issue with tfjs

import fetch from 'node-fetch'

import msgpack from 'msgpack-lite'

console.log(tf.tensor(2))

// console.log(fetch('hello'))

// See,s pl

console.log(msgpack.encode(2))
