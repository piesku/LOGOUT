//
// Variables used by fragment shader
//
// vec4 c; // color
// vec3 fp; // fragment position
// vec3[MAX_LIGHTS] lp; // light position
// vec3[MAX_LIGHTS] lc; // light color
// float[MAX_LIGHTS] li; // light intensity
// int al; // active lights
// vec3 fn; // vertex normals
// vec3 fc; // fog color
// vec2 fd; // fog distance

export function fragment(defines) {
  return `#version 300 es

    ${defines.map(def => `
      #define ${def}
    `).join('')}

    precision mediump float;

    uniform vec4 c;

    in vec3 fp;

    #ifdef LIGHTS
      uniform vec3[100] lp;
      uniform vec3[100] lc;
      uniform float[100] li;
      uniform int al;

      in vec3 fn;
    #endif

    #ifdef FOG
      uniform vec3 fc;
      uniform vec2 fd;
      in float fdist;
    #endif

    out vec4 frag_color;

    void main()
    {
      #ifdef FOG
        float ff = clamp((fd.y - fdist) / (fd.y - fd.x), 0.0, 1.0);
      #endif

      #ifdef LIGHTS
        vec4 light = vec4(0.0, 0.0, 0.0, 1.0);
        for (int i = 0; i < al; i++) {
          vec3 ldir = lp[i] - fp;
          vec3 L = normalize(ldir);
          float df = max(dot(fn, L), 0.0);
          vec3 rgb = c.rgb * df * lc[i] * li[i] / length(ldir);
          light += vec4(rgb, c.a);
        }

        #ifdef FOG
          frag_color = mix(vec4(fc, 1.0), light, ff);
        #else
          frag_color = light;
        #endif
      #else
          #ifdef FOG
            frag_color = mix(vec4(fc, 1.0), c, ff);
          #else
            frag_color = c;
          #endif
      #endif
    }
  `;
}
