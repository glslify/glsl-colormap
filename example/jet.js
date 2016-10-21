var glsl = require('glslify')
var regl = require('regl')()
var draw = regl({
  frag: glsl`
    precision mediump float;
    #pragma glslify: jet = require('../jet')
    varying vec2 uv;
    void main () {
      gl_FragColor = jet(uv.x);
    }
  `,
  vert: `
    precision mediump float;
    attribute vec2 position;
    varying vec2 uv;
    void main () {
      uv = (position+1.0)*0.5;
      gl_Position = vec4(position,0,1);
    }
  `,
  attributes: {
    position: [-4,4,-4,-4,4,0]
  },
  count: 3
})
draw()
