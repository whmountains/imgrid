#!/usr/bin/env node

"use strict";

const _    = require('lodash')
const path = require('path')

const respawn = require('./src/lib/respawn')

// we need to call the src/imgrid.js with harmony flags enabled

// path to node == process.argv[0]
let node = process.argv.shift()
// splice in extra v8 flags
let flags = ['--harmony', '--harmony_destructuring']
let argv = [node, ...flags, ...process.argv]
// change filename to point to proper location
argv[flags.length+1] = path.join(__dirname, 'src/imgrid.js')

// respawn with new argv
respawn(argv)
