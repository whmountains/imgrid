"use strict";

// just a dummy logging function for now
module.exports = function(data) {
  console.log(data)
  return Promise.resolve(data)
}
