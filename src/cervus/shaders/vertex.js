// Variables used by Vertex shader
//
// mat4 p; //projection
// mat4 v; //view
// mat4 w; // world
// vec3 P_current; // current frame vertex position
// float frame_delta;
// vec3 P_next; // next frame vertex position
// vec3 N_next; // next frame normal
// vec3 N_current; // current frame normal
// vec3 fn; // output normal
// vec2 a_t; // texture coordinates
// vec2 v_t; // texture coordinates output

export function vertex(defines) {
  return `#version 300 es

    ${defines.map(def => `
      #define ${def}
    `).join('')}

    precision mediump float;

    uniform mat4 p;
    uniform mat4 v;
    uniform mat4 w;

    in vec3 P_current;

    #ifdef LIGHTS
      in vec3 N_current;
      out vec3 fn;
    #endif

    #ifdef FOG
      uniform vec3 camera;
      out float f_distance;
    #endif

    out vec3 fp;

    void main()
    {

        fp = (w * vec4(P_current, 1.0)).xyz;

        #ifdef LIGHTS
          fn = (vec4(N_current, 0.0)).xyz;
        #endif

      gl_Position = p * v * vec4(fp, 1.0);

      #ifdef FOG
        f_distance = distance(w * vec4(P_current, 1.0), vec4(camera, 1.0));
      #endif
    }
  `;
}
