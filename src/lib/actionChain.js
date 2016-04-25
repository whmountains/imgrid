"use strict";

let _ = require('lodash')
let merge = require('./mergeItems')


exports.series = function(...actions) {

  // return function that will start the chain when called
  return function(params) {

    // empty promise that will pass params into the chain
    var seed = Promise.resolve(params)

    // chain each action into the next.  call .then on each returned promise
    var actionChain = _.reduce(actions, function(chain, action) {
      return chain.then(action)
    }, seed)

    return actionChain
  }

}




exports.parallel = function(...actions) {
  return function(params) {

    // start all the actions
    actions = _.map(actions, a => a(params))

    // wait for them to all finish
    return Promise.all(actions)

    // merge all the results into one object before returning
    .then(merge)

  }
}





// Built-in unit tests
if (process.argv[2] === "test") {

  // constructor function that takes the change amount, etc.
  let f = function(change, message, delay) {
    // promise-returning function that does the change
    return function(total) {
      // return a promise for when the change has happened
      return new Promise(function(resolve) {
        // set a timeout to perform the change
        setTimeout(function() {
          console.log(`${total} += ${change} ${message}`)
          // resolve the promise with the new value
          resolve(total+change)
        }, delay || 100)
      })
    }
  }

  let chain = exports.series(
    f(1, 'series'),
    f(1, 'series'),
    f(1, 'series'),
    exports.parallel(
      f(1,  'parallel', 100),
      f(1,  'parallel', 100),
      f(1,  'parallel', 100),
      f(-1, 'parallel', 50) //finish first
    ),
    f(1, 'series')
  )

  chain(10).then(function(total) {

    console.log(`final total = ${total}`)

    // total should be original, plus four sequence events, plus last parallel event
    if (total === 13)
      console.log('test passed!')
    else
      console.log('test failed!')

  })
}
