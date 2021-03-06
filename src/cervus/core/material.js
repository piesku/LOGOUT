import { create_program_object, create_shader_object, gl } from './context';
import { Transform, Render } from '../components';

import { vertex } from '../shaders';
import { fragment } from '../shaders';

export class Material {
  constructor(options = {}) {
    this.uniforms = {};
    this.attribs = {};
    this.draw_mode = gl.TRIANGLES;
    this.features = new Set([].concat(
      ...Array.from(options.requires || []).map(comp => comp.features))
    );

    this._textures = {};

    this.texture = options.texture || false;
    this.normal_map = options.normal_map || false;
  }

  add_feature(feature) {
    this.features.add(feature);
  }

  has_feature(feature) {
    return this.features.has(feature);
  }

  remove_feature(feature) {
    this.features.delete(feature);
  }

  add_fog(options = {}) {
    this.add_feature('FOG');
    this.fog = {
      color: options.color || new Float32Array([0, 0, 0]),
      // Distance of fog [where fog starts, where fog completely covers object]
      distance: options.distance || new Float32Array([10, 30])
    };

    this.setup_program();
  }

  setup_program() {
    this.program = create_program_object(
      create_shader_object(
        gl.VERTEX_SHADER,
        vertex(Array.from(this.features))
      ),
      create_shader_object(
        gl.FRAGMENT_SHADER,
        fragment(Array.from(this.features))
      )
    );

    if (this.program.error) {
      console.log(this.program.error); return;
    } else {
      this.get_locations();
    }

  }

  get_uniforms_and_attrs(uniforms, attrs) {
    uniforms.forEach(uniform => {
      this.uniforms[uniform] = gl.getUniformLocation(this.program, uniform);
    });

    attrs.forEach(attr => {
      this.attribs[attr] = gl.getAttribLocation(this.program, attr);
    });
  }

  // apply_shader(entity, game) {
  //
  // }

  set texture(image_promise) {
    this.build_texture(image_promise, this._texture_image, 'TEXTURE', 'gl_texture');
  }

  get texture() {
    return this._texture_image;
  }

  set normal_map(image_promise) {
    this.build_texture(image_promise, this._normal_map_image, 'NORMAL_MAP', 'gl_normal_map');
  }

  get normal_map() {
    return this._normal_map_image;
  }

  build_texture(image_promise, url_location, feature, gl_texture_key) {
    if (image_promise) {
      if (!this._textures[gl_texture_key]) {
        this._textures[gl_texture_key] = gl.createTexture();
      }

      image_promise.then(image => {
        if (url_location !== image) {
          url_location = image;

          gl.bindTexture(gl.TEXTURE_2D, this._textures[gl_texture_key]);
          gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA,gl.UNSIGNED_BYTE, image);
          gl.generateMipmap(gl.TEXTURE_2D);

          if (!this.has_feature(feature)) {
            this.add_feature(feature);
            this.setup_program();
          }
        }
      })
      .catch(console.error);

    } else if (!image_promise) {

      url_location = null;
      this.remove_feature(feature);
      this.setup_program();

    }
  }

  render(entity) {
    gl.useProgram(this.program);
    gl.uniformMatrix4fv(this.uniforms.p, gl.FALSE, entity.game.projMatrix.toFloat32Array());
    gl.uniformMatrix4fv(this.uniforms.v, gl.FALSE, entity.game.viewMatrix.toFloat32Array());

    gl.uniformMatrix4fv(
      this.uniforms.w,
      gl.FALSE,
      entity.get(Transform).world.toFloat32Array()
    );

    gl.uniform4fv(
      this.uniforms.c,
      entity.get(Render).color_vec
    );

    this.apply_shader(entity, game);
  }
}
