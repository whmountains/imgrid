var extname = require('path').extname

var exts = [
  '.jpeg',
  '.jpg',
  '.tiff',
  '.tif',
  '.png',
  '.webp',
  '.gif'
]

module.exports = function(filename) {

  // get the file extention
  var ext = extname(filename)

  // check if it's in the array
  return inArray(exts, ext)

}

var inArray = function(searchArray, searchElement) {
  'use strict';
  var O = Object(searchArray);
  var len = parseInt(O.length) || 0;
  if (len === 0) {
    return false;
  }
  var n = parseInt(arguments[1]) || 0;
  var k;
  if (n >= 0) {
    k = n;
  } else {
    k = len + n;
    if (k < 0) {k = 0;}
  }
  var currentElement;
  while (k < len) {
    currentElement = O[k];
    if (searchElement === currentElement ||
       (searchElement !== searchElement && currentElement !== currentElement)) { // NaN !== NaN
      return true;
    }
    k++;
  }
  return false;
};
