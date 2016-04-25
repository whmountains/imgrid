"use strict";

// node module dependencies
let meow = require('meow')
let path = require('path')

// local libs
let chain = require('./lib/actionChain')

// async actions
let getSrcImages  = require('./getSrcImages')
let scaffoldDest  = require('./scaffoldDest')
let processImages = require('./processImages')
let genConfig     = require('./genConfig')


// define cli interface
const cli = meow(`

  imgrid: generate simple static masonry-style image galleries

	Usage
	  $ imgrid <src> <dest>

	Options
    --noimg  Skip Image generation

	Examples
	  $ imgrid /path/to/src /path/to/dest
`)

// make sure we have the right number of args
if (cli.input.length !== 2) {
  cli.showHelp(1)
}

// normalize cli options
let src      = path.resolve(cli.input[0])
let dst      = path.resolve(cli.input[1])
let noimg    = Boolean(cli.flags.noimg)
let imgDir   = path.join(dst, 'img')

let cfg = {src, dst, noimg}

// create data object to pass down the chain
let data = {cfg, images: []}

// create action chain
let actionChain = chain.series(
  chain.parallel(
    getSrcImages, //populates the list of source images
    scaffoldDest //sets up source
  ),
  processImages, //reads images, processes them, and saves them
  genConfig      //creates gallery.json
)

// start the chain
actionChain(data)

// clean up when we're done
.then(function({cfg, images}) {
  console.log(`All Done!  Gallery created with ${images.length} images.`)
})

// catch any errors along the way
.catch(function(err) {
  throw new Error(err)
})
