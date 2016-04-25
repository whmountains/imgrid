"use strict";

var path = require('path')
var _    = require('lodash')

var isImage = require('./lib/isImg')
var fs      = require('./lib/fs')

// destructure params into two separate variables
module.exports = function({cfg, images}) {


  // Utility functions - - - - - - - - - - - - - - - - - - -

  var getAbsPath = function(filename) {
    return path.join(cfg.src, filename)
  }



  // Actual code - - - - - - - - - - - - - - - - - - - - - -

  // read src dir
  return fs.readdirAsync(cfg.src)
  .then(function(files) {

    // filter out files that don't seem to be images
    files = _.filter(files, isImage)

    // map images into data structure with absolute paths
    // until now images == empty array
    images = _.map(files, name => ({
      original: name,
      src: getAbsPath(name)
    }))

    console.log(`Found ${images.length} files in src dir.`)

    return {cfg, images}

  })

}
