"use strict";

// add the 'loaded' class to a grid image
let mkVisible = function(node) {
  node.classList.add('loaded')
}

// sequetial reveal animation queue
let actionQueue  = Array(10000)
let cursor = 0
let enterQueue = function(i, ev) {
  actionQueue[i] = mkVisible.bind(this, ev.target)
}
let processQueue = function() {
  let action = actionQueue[cursor]
  if (action) {
    action && action()
    cursor = cursor + 1
  }
}
setInterval(processQueue, 50)

// setup loading animations
let setupLoadingAnim = function(grid) {
  let images = grid.children

  for (var i = 0; i < images.length; i++) {
    let img = images[i]
    img.onload = enterQueue.bind(this, i)
  }
}

let insertImages = function({grid, images}) {
  let imgHTML = images.map(img => {
    return `<img src="img/${img.webpthumb}" scrset="img/${img.webpthumb}, img/${img.jpegthumb}" />`
  }).join('')
  grid.innerHTML = imgHTML
}

let getSlides = function(images) {
  return images.map(i => ({src:i.webpfull, w,h}))
}

let pswpInit = function({cfg, images}) {

  // var slides =

}


// hook into already in progress gallery fetch
galleryFetch
.then(({cfg, images}) => {

  let grid = document.querySelector('.grid')

  insertImages({grid, images})
  setupLoadingAnim(grid)
  pswpInit({cfg, images})

})
