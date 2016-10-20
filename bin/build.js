#!/usr/bin/env node
var data = require('colormap/colorScales.js')
var gen = require('../index.js')
var fs = require('fs')
var path = require('path')

Object.keys(data).forEach(function (name) {
  var file = path.join(__dirname, '..', name + '.glsl')
  fs.writeFile(file, gen(name, data[name]))
})
