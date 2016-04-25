"use strict";

let cpr = require('cpr')
let Promise = require('bluebird')

module.exports = Promise.promisify(cpr)
