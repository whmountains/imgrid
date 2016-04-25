"use strict";

let path = require('path')
let c    = require('chalk')

let fs = require('./lib/fs')

module.exports = function(data) {

  if (data.cfg.noimg) {
    console.log(c.red('NOT writing gallery.json'))
    return Promise.resolve(data)
  }

  var jsonOut = JSON.stringify(data)
  var dest    = path.join(data.cfg.dst, 'gallery.json')

  return fs.writeFileAsync(dest, jsonOut).then(() => {
    console.log(`${c.blue('WRITE')}  gallery.json`)
    return data
  })

}
