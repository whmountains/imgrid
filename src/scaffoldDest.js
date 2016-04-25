"use strict";

let path = require('path')
let cpr  = require('./lib/cpr')


module.exports = function({cfg, images}) {

  // template directory to copy from
  var tplDir = path.resolve(__dirname, '../tpl')
  var dstDir = cfg.dst

  return cpr(tplDir, dstDir, {
    overwrite: true,
    confirm: true,
  })

  // pass through the original args for chaining
  .then(function(files) {
    console.log(`Scaffolded ${files.length} destination files`)
    return {cfg, images}
  })

}
