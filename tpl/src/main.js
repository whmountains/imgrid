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


// hook into already in progress gallery fetch
galleryFetch
.then(({cfg, images}) => {

  let grid = document.querySelector('.grid')

  let imgHTML = images.map(img => {
    return `<img src="img/${img.webpthumb}" scrset="img/${img.webpthumb}, img/${img.jpegthumb}" />`
  }).join('')

  grid.innerHTML = imgHTML

  // setup loading animations
  var images = grid.children

  for (var i = 0; i < images.length; i++) {
    let img = images[i]
    console.log(img, i)
    img.onload = enterQueue.bind(this, i)
  }

})
