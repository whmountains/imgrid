var mkdirp = require('mkdirp')
var Promise = require('bluebird')

module.exports = Promise.promisify(mkdirp)
