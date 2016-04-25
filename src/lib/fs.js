var Promise = require('bluebird')
var fs      = require('fs')

Promise.promisifyAll(fs)

module.exports = fs
