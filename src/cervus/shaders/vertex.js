// Variables used by Vertex shader
//
// mat4 p; //projection
// mat4 v; //view
// mat4 w; // world
// vec3 vp; // current frame vertex position
// vec3 vn; // current frame normal
// vec3 fn; // output normal

export function vertex(defines) {
  return `#version 300 es

    ${defines.map(def => `
      #define ${def}
    `).join('')}

    precision mediump float;

    uniform mat4 p;
    uniform mat4 v;
    uniform mat4 w;

    in vec3 vp;

    #ifdef LIGHTS
      in vec3 vn;
      out vec3 fn;
    #endif

    #ifdef FOG
      uniform vec3 camera;
      out float fdist;
    #endif

    out vec3 fp;

    void main()
    {

        fp = (w * vec4(vp, 1.0)).xyz;

        #ifdef LIGHTS
          fn = (vec4(vn, 0.0)).xyz;
        #endif

      gl_Position = p * v * vec4(fp, 1.0);

      #ifdef FOG
        fdist = distance(w * vec4(vp, 1.0), vec4(camera, 1.0));
      #endif
    }
  `;
}
