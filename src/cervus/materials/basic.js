import { gl } from '../core/context';
import { Material } from '../core';

import { Render, Transform } from '../components';

export class BasicMaterial extends Material {
  constructor(options) {
    super(options);

    this.setup_program();
  }

  get_locations() {
    this.get_uniforms_and_attrs(
      ['p', 'v', 'w', 'c', 'fc', 'fd', 'camera'],
      ['vp']
    );
  }

  apply_shader(entity, game) {
    let render = entity.get(Render);
    let buffers = render.buffers;

    if (render.material.has_feature('FOG')) {
      gl.uniform3fv(this.uniforms.fc, this.fog.color);
      gl.uniform2fv(this.uniforms.fd, this.fog.distance);
      gl.uniform3fv(this.uniforms.camera, game.camera.get(Transform).position);
    }

    // current frame
    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.vertices);
    gl.vertexAttribPointer(
      this.attribs.vp,
      3, gl.FLOAT, gl.FALSE,
      0, 0
    );

    gl.enableVertexAttribArray(this.attribs.vp);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffers.indices);
    gl.drawElements(this.draw_mode, buffers.qty, gl.UNSIGNED_SHORT, 0);
  }
}
