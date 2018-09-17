// #define MAX_LIGHTS 100
//
// Variables used by fragment shader
//
// vec4 c; // color
// vec3 fp; // vertex position
// vec3[MAX_LIGHTS] lp; // light position
// vec3[MAX_LIGHTS] lc; // light color
// float[MAX_LIGHTS] li; // light intensity
// int al; // active lights
// vec3 fn; // vertex normals
// vec2 v_t; // texture coordinates
// sampler2D u_t; //texture
// sampler2D n_m; // normal map

export function fragment() {
  return `#version 300 es

    precision mediump float;

    uniform vec4 c;

    in vec3 fp;

      uniform vec3[100] lp;
      uniform vec3[100] lc;
      uniform float[100] li;
      uniform int al;

      in vec3 fn;

      uniform vec3 fog_color;
      uniform vec2 fog_distance;
      in float f_distance;

    out vec4 frag_color;

    void main()
    {
        float fog_factor = clamp((fog_distance.y - f_distance) / (fog_distance.y - fog_distance.x), 0.0, 1.0);

          vec4 p_c = c;

          vec3 n = fn;

        vec4 light = vec4(0.0, 0.0, 0.0, 1.0);
        for (int i = 0; i < al; i++) {
          vec3 light_dir = lp[i] - fp;
          vec3 L = normalize(light_dir);
          float light_dist = length(light_dir);
          float diffuse_factor = max(dot(n, L), 0.0);
          vec3 rgb = p_c.rgb * diffuse_factor * lc[i] * li[i] / light_dist;
          light += vec4(rgb, p_c.a);
        }

          frag_color = mix(vec4(fog_color, 1.0), light, fog_factor);
    }
  `;
}
