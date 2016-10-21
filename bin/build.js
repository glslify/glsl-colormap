#!/usr/bin/env node
var data = require('colormap/colorScales.js')
var colors = Object.keys(data)
var gen = require('../index.js')
var fs = require('fs')
var path = require('path')

var file = path.join(__dirname, '..', 'colors.json')
fs.writeFile(file, JSON.stringify(colors))
colors.forEach(function (name) {
  var file = path.join(__dirname, '..', name + '.glsl')
  fs.writeFile(file, gen(name, data[name]))
})
