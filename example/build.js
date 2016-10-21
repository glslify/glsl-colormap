var fs = require('fs')
var colors = require('../colors.json')

colors.forEach(function (color) {
  var src = `
    precision mediump float;
    #pragma glslify: map = require('../../${color}')
    varying vec2 uv;
    void main () {
      gl_FragColor = map(uv.x*2.0/1.5);
    }
  `.trim().replace(/^\s{4}/gm,'') + '\n'
  fs.writeFile('frag/' + color + '.glsl', src)
})
