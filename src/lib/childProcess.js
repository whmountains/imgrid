var bluebird = require('bluebird')
var child    = require('child_process')

module.exports = bluebird.promisifyAll(child)
