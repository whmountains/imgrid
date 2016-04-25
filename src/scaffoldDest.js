"use strict";

let path = require('path')
let child = require('./lib/childProcess')
let mkdirp = require('./lib/mkdirp')


module.exports = function({cfg, images}) {

  // template file to copy from
  let tpl = path.resolve(__dirname, '../tpl.tar.gz')

  // dest dir
  let dst = cfg.dst

  // create dest dir if it doesn't exist yet
  return mkdirp(cfg.dst).then(() => {
    // unpack template into dest
    console.log('Unpacking gallery template')
    return child.execAsync(`tar -xzf ${tpl} -C ${dst}`)
  })

  // pass through the original args for chaining
  .then(function(files) {
    console.log(`Scaffolded ${files.length} destination files`)
    return {cfg, images}
  })

}
