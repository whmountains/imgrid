"use strict";

// mergeitems.js: object.assign works in the reverse order if arguments are primitives instead of objects.  We wrap each item in a dummy object to make things consistent.

var _ = require('lodash')


// items: array items to merge
module.exports = function(items) {

  // wrap each item in a dummy object
  items = _.map(items, i => ({i}))

  // merge them all into new object
  let item = _.merge(...items)

  // return unwrapped merged object
  return item.i

}


// Built-in unit tests
if (process.argv[2] === "test") {

  // variable to hold test results
  let result

  // test with primitives
  result = module.exports([1,2,3])
  if (result === 3)
    console.log('primitives test passed')
  else
    console.log(`primitives test failed (${result})`)

  // test with objects
  result = module.exports([{a:1},{a:2},{a:3}])
  if (result.a === 3)
    console.log('objects test passed')
  else
    console.log(`objects test failed (${result})`)

}
