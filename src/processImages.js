"use strict";

var path  = require('path')
var sharp = require('sharp')
var _     = require('lodash')
var c     = require('chalk')

var fs    = require('./lib/fs')


// same "chainable task" signature but takes a single image
var convertImg = function({image, cfg}) {

  // create source stream
  let pipeline = sharp(image.src)

  // wait for image info
  pipeline.on('info', function(info) {
    console.log(info)
    image.width  = info.width
    image.height = info.height
  })

  // resize
  let fullscreen = pipeline.clone()
    .resize(null,800)
  let thumbnail  = pipeline.clone()
    .resize(null,250)

  // destination file names
  let uid = _.uniqueId()
  image.jpegfull  = `${uid}-full.jpeg`
  image.webpfull  = `${uid}-full.webp`
  image.jpegthumb = `${uid}-thumb.jpeg`
  image.webpthumb = `${uid}-thumb.webp`


  // function to save an image and log about it
  let saveImg = function(stream, filename) {

    // we'll need this in two places
    let createPath = path.join('img', filename)

    // clone the stream and save it
    return stream.clone()
    .toFile(path.join(cfg.dst, createPath))

    // log about it once we're done
    .then(function() {
      console.log(`${c.green('CREATE')} ${createPath}`)
    })

  }

  // save each size in jpeg and webp
  return Promise.all([
    saveImg(fullscreen, image.jpegfull),
    saveImg(fullscreen, image.webpfull),
    saveImg(thumbnail,  image.jpegthumb),
    saveImg(thumbnail,  image.webpthumb),
  ])
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
