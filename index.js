module.exports = function (name, scale) {
  var defs = [], mix = []
  var rgb = scale.map(function (x) {
    var c = x.rgb.map(function (r, ri) { return ri < 3 ? r/255 : r })
    return c.length === 4 ? c : c.concat(1)
  })
  for (var i = 0; i < scale.length; i++) {
    defs.push(`const float e${i} = ${tof(scale[i].index)};`)
    defs.push(`const vec4 v${i} = vec4(${rgb[i].join(',')});`)
  }
  for (var i = 0; i < scale.length-1; i++) {
    defs.push(`float a${i} = smoothstep(e${i},e${i+1},x);`)
    mix.push(`mix(v${i},v${i+1},a${i})`
      + `*step(e${i},x)*step(x,e${i+1})`);
  }
  var fname = name.replace(/\W+/g,'_')
  return `
    vec4 ${fname} (float x) {
      ${defs.join('\n      ')}
      return ${
        mix.length === 1 ? mix[0]
          : `max(${mix.slice(0,-1).join(',\n        max(')
            + ',' + mix[mix.length-1]
            + '\n      ' + Array(mix.length-1).join(')')})`
      };
    }
    #pragma glslify: export(${fname})
  `.trim().replace(/^\s{0,4}/gm,'') + '\n'
}

function tof (x) {
  return /\./.test(x) ? String(x) : String(x)+'.0'
}
