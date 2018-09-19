import { gl } from '../core/context';
import { Material } from '../core';

import { Render, Morph, Light, Transform } from '../components';

export class PhongMaterial extends Material {
  constructor(options) {
    super(options);
    this.add_feature('LIGHTS');

    this.setup_program();
  }

  get_locations() {
    this.get_uniforms_and_attrs(
      ['p', 'v', 'w', 'lp', 'li', 'lc', 'al', 'c', 'u_t', 'n_m', 'frame_delta', 'fog_color', 'fog_distance', 'camera'],
      ['P_current', 'P_next', 'N_current', 'N_next', 'a_t']
    );
  }

  apply_shader(entity, game) {
    let render = entity.get(Render);
    let buffers = render.buffers;

    if (render.material.has_feature('FOG')) {
      gl.uniform3fv(this.uniforms.fog_color, this.fog.color);
      gl.uniform2fv(this.uniforms.fog_distance, this.fog.distance);
      gl.uniform3fv(this.uniforms.camera, game.camera.get(Transform).position);
    }

    // current frame
    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.vertices);
    gl.vertexAttribPointer(
      this.attribs.P_current,
      3, gl.FLOAT, gl.FALSE,
      0, 0
    );

    gl.enableVertexAttribArray(this.attribs.P_current);

    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.normals);
    gl.vertexAttribPointer(
      this.attribs.N_current,
      3, gl.FLOAT, gl.FALSE,
      0, 0
    );
    gl.enableVertexAttribArray(this.attribs.N_current);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffers.indices);
    gl.drawElements(this.draw_mode, buffers.qty, gl.UNSIGNED_SHORT, 0);

    let lights = Array.from(game.all.get(Light));
    let lights_count = lights.length;
    let light_position = new Float32Array(lights_count * 3);
    let light_color = new Float32Array(lights_count * 3);
    let light_intensity = new Float32Array(lights_count);

    for (let i = 0; i < lights_count; i++) {
      let light_transform = lights[i].entity.get(Transform);
      let world_position = light_transform.world.slice(12, 15);
      light_position.set(world_position, i * 3);
      light_color.set(lights[i].color_vec, i * 3);
      light_intensity[i] = lights[i].intensity;
    }

    gl.uniform1i(this.uniforms.al, lights_count);

    gl.uniform3fv(this.uniforms.lp, light_position);
    gl.uniform3fv(this.uniforms.lc, light_color);
    gl.uniform1fv(this.uniforms.li, light_intensity);

  }
}
