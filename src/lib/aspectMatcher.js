"use strict";

var _ = require('lodash')

// allowed aspect ratios
const allowedSideRatios = [
  {x:16, y:9 },
  {x:12, y:9 },
  {x: 9, y:9 },
  {x: 9, y:12},
  {x: 9, y:16},
]

const allowedRatios = _.map(allowedSideRatios, r => r.y/r.x)

var getBestRatio = function(imageRatio, possibleRatios) {
  // find which of the canned aspect ratios is closest to the image ratio
  return _.minBy(possibleRatios, tryRatio => {
    return Math.abs(imageRatio-tryRatio)
  })
}

// Exports --------------------------
exports.byDecimal = function(ratio) {
  return getBestRatio(ratio, allowedRatios)
}
exports.bySides = function(x, y) {
  return exports.byDecimal(y/x)
}




// Built-in unit tests
if (process.argv[2] === "test") {

  var util = require('util')
  var c    = require('chalk')

  const testImages = [
    {x:160, y:90,  ans:  90/160},
    {x:120, y:90,  ans:  90/120},
    {x:90,  y:90,  ans:  90/90},
    {x:90,  y:120, ans: 120/90},
    {x:90,  y:160, ans: 160/90}
  ]

  var passCount = 0
  var failCount = 0

  _.each(testImages, img => {

    let result = exports.bySides(img.x, img.y)

    let inspected = util.inspect(img)
    let expected  = _.padEnd(String(result).substr(0,8), 8)

    if (result === img.ans)
      console.log(`${chalk.green('PASS')} ${expected} == ${inspected}`)
    else
      console.log(`${chalk.red('FAIL')} ${expected} != ${inspected}`)

  })

}
