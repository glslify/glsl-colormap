var glsl = require('glslify')
var vtext = require('vectorize-text')
var colors = require('../colors.json')

var canvas = document.createElement('canvas')
canvas.setAttribute('width', window.innerWidth * 0.9)
canvas.setAttribute('height', 30 * colors.length)
document.body.appendChild(canvas)

var regl = require('regl')(canvas)
var frag = {
  alpha: glsl.file('./frag/alpha.glsl'),
  autumn: glsl.file('./frag/autumn.glsl'),
  bathymetry: glsl.file('./frag/bathymetry.glsl'),
  blackbody: glsl.file('./frag/blackbody.glsl'),
  bluered: glsl.file('./frag/bluered.glsl'),
  bone: glsl.file('./frag/bone.glsl'),
  cdom: glsl.file('./frag/cdom.glsl'),
  chlorophyll: glsl.file('./frag/chlorophyll.glsl'),
  cool: glsl.file('./frag/cool.glsl'),
  copper: glsl.file('./frag/copper.glsl'),
  cubehelix: glsl.file('./frag/cubehelix.glsl'),
  density: glsl.file('./frag/density.glsl'),
  earth: glsl.file('./frag/earth.glsl'),
  electric: glsl.file('./frag/electric.glsl'),
  'freesurface-blue': glsl.file('./frag/freesurface-blue.glsl'),
  'freesurface-red': glsl.file('./frag/freesurface-red.glsl'),
  greens: glsl.file('./frag/greens.glsl'),
  greys: glsl.file('./frag/greys.glsl'),
  hot: glsl.file('./frag/hot.glsl'),
  hsv: glsl.file('./frag/hsv.glsl'),
  inferno: glsl.file('./frag/inferno.glsl'),
  jet: glsl.file('./frag/jet.glsl'),
  magma: glsl.file('./frag/magma.glsl'),
  oxygen: glsl.file('./frag/oxygen.glsl'),
  par: glsl.file('./frag/par.glsl'),
  phase: glsl.file('./frag/phase.glsl'),
  picnic: glsl.file('./frag/picnic.glsl'),
  plasma: glsl.file('./frag/plasma.glsl'),
  portland: glsl.file('./frag/portland.glsl'),
  rainbow: glsl.file('./frag/rainbow.glsl'),
  'rainbow-soft': glsl.file('./frag/rainbow-soft.glsl'),
  rdbu: glsl.file('./frag/rdbu.glsl'),
  salinity: glsl.file('./frag/salinity.glsl'),
  spring: glsl.file('./frag/spring.glsl'),
  summer: glsl.file('./frag/summer.glsl'),
  temperature: glsl.file('./frag/temperature.glsl'),
  turbidity: glsl.file('./frag/turbidity.glsl'),
  'velocity-blue': glsl.file('./frag/velocity-blue.glsl'),
  'velocity-green': glsl.file('./frag/velocity-green.glsl'),
  viridis: glsl.file('./frag/viridis.glsl'),
  warm: glsl.file('./frag/warm.glsl'),
  winter: glsl.file('./frag/winter.glsl'),
  yignbu: glsl.file('./frag/yignbu.glsl'),
  yiorrd: glsl.file('./frag/yiorrd.glsl')
}

regl.clear({ color: [1,1,1,1], depth: true })
regl({
  frag: `
    precision mediump float;
    uniform float w, h;
    varying vec2 uv;
    void main () {
      float x = mod(floor(w*uv.x)+floor(h*uv.y),2.0);
      gl_FragColor = vec4(vec3(x),1);
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
    position: [-1,-1,-1,1,0.5,-1,-1,1,0.5,-1,0.5,1]
  },
  uniforms: {
    w: function (context) {
      var aspect = context.viewportWidth / context.viewportHeight
      return aspect > 1 ? 128 : 128 * aspect
    },
    h: function (context) {
      var aspect = context.viewportWidth / context.viewportHeight
      return aspect > 1 ? 128 * aspect : 128
    }
  },
  count: 6,
  blend: {
    enable: true,
    func: { src: 'src alpha', dst: 'one minus src alpha' }
  },
  depth: { enable: false, mask: false }
})()
colors.forEach(function (name, i) {
  var x0 = -1, x1 = 0.5
  var y0 = 1-2*i/colors.length
  var y1 = 1-2*(i+1)/colors.length
  var ty0 = 1-2*(i+1.75)/colors.length
  regl({
    frag: frag[name],
    vert: glsl`
      precision mediump float;
      attribute vec2 position;
      varying vec2 uv;
      void main () {
        uv = (position+1.0)*0.5;
        gl_Position = vec4(position,0,1);
      }
    `,
    attributes: {
      position: [x0,y0,x0,y1,x1,y0,x0,y1,x1,y0,x1,y1]
    },
    count: 6,
    blend: {
      enable: true,
      func: { src: 'src alpha', dst: 'one minus src alpha' }
    },
    depth: { enable: false, mask: false }
  })()
  var text = vtext(name, {
    lineHeight: 2/colors.length,
    triangles: true
  })
  regl({
    frag: `
      precision mediump float;
      void main () {
        gl_FragColor = vec4(0,0,0,1);
      }
    `,
    vert: `
      precision mediump float;
      attribute vec2 position;
      void main () {
        gl_Position = vec4(position.x+0.55,float(${ty0})-position.y,0,1);
      }
    `,
    attributes: {
      position: text.positions
    },
    elements: text.cells
  })()
})
