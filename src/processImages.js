"use strict";

var path  = require('path')
var sharp = require('sharp')
var _     = require('lodash')
var c     = require('chalk')

var fs    = require('./lib/fs')

// create a promise that is fulfilled
//when the input stream emits the 'info' event
let imgInfo = function(sharpStream) {
  return new Promise((resolve, reject) => {
    sharpStream.on('info', i => resolve(i))
  })
}

// function to save an image and log about it
let saveImg = function({basePath, sharpSource, filename, suffix, format}) {
  // we can't use sharp's promise because it doesn't give us any image info
  return new Promise((resolve, reject) => {

    // place to save image info
    let imgInfo = {}

    // defined separately so we can remove it from the EventEmitter
    let imgCreated = function() {
      console.log(`${c.green('CREATE')} ${createPath}`)
      resolve(imgInfo)
    }

    // calculate the path to the new image
    let createPath = path.join('img', `${filename}${suffix}.${format}`)
    // open the destination file
    var dstFile = fs.createWriteStream(path.join(basePath, createPath))
    // fulfill our promise when the file is done being written to
    dstFile.on('finish', imgCreated)

    // clone the input stream
    let stream = sharpSource.clone()
    // set the format
    stream.toFormat(format)
    // pipe to dest file
    stream.pipe(dstFile)

    // save info events
    stream.on('info', i => imgInfo = i)

    // reject on errors
    stream.on('error', e => {
      // prevent a false fulfillment
      dstFile.removeListener('finish', imgCreated)
      // reject the promise
      reject(e)
    })

  })
}

// same "chainable task" signature but takes a single image
var convertImg = function({image, cfg}) {

  // basename of our new image
  image.name = _.uniqueId()

  // shortcut function for later
  let save = function(sharpSource, suffix, format) {
    return saveImg({
      sharpSource, suffix, format,
      basePath: cfg.dst,
      filename: image.name
    })
  }

  // create source stream
  let pipeline = sharp(image.src)

  // resize
  let fullscreen = pipeline.clone()
    .resize(null,800)
  let thumbnail  = pipeline.clone()
    .resize(null,250)

  // save the images to files
  let saveActions = Promise.all([
    save(thumbnail,  '-thumb', 'jpeg'),
    save(thumbnail,  '-thumb', 'webp'),
    save(fullscreen, '-full',  'jpeg'),
    save(fullscreen, '-full',  'webp'),
  ])
  // extract image dimentions
  .then(infos => {
    image.full = {
      w: infos[0].width,
      h: infos[0].height
    }
    image.thumb = {
      w: infos[2].width,
      h: infos[2].height
    }
  })
  // catch errors reading images
  .catch(e => {
    console.log(`${c.red('ERROR')}  ${image.src}`)
    console.log(e)
  })

  // wait for everything to finish
  return saveActions
  // return the image objects
  .then(function() {
    return {image, cfg}
  })

}

module.exports = function({cfg, images}) {

  // short-circuit if image processing is disabled
  if (cfg.noimg)
    return Promise.resolve({cfg, images})

  // announce what we're doing
  console.log('Starting image processing...')

  // start the processing for each image
  let processing = images.map(image => {
    return convertImg({image, cfg})

    // extract the image object from the return value
    .then(({cfg, image}) => image)

    // gracefully handle errors
    .catch(e => {
      console.log(`${c.red('ERROR')}  ${image.src}`)
      console.log(e)
    })

  })

  // repackage the images into the data object when we're done
  return Promise.all(processing)
  .then(images => {
    images = _.compact(images)
    return {cfg, images}
  })

}
