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
setInterval(processQueue, 100)

// setup loading animations
let setupLoadingAnim = function(grid) {
  let images = grid.children

  for (var i = 0; i < images.length; i++) {
    let img = images[i].children[1]
    img.onload = enterQueue.bind(this, i)
  }
}

let insertImages = function({grid, images}) {

  grid.innerHTML = images.map(img => {

    let imgPath = `img/${img.name}-thumb`

    return `
      <picture>
        <source type="image/webp" srcset="${imgPath}.webp">
        <img src="${imgPath}.jpeg"/>
      </picture>
    `

  }).join('')
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
