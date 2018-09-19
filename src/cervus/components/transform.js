import { Component } from '../core/component';
import { vec3, mat4, quat } from '../math';

let default_options = {
  _scale: vec3.unit.slice(),
  _rotation: quat.create(),

  scale: vec3.unit.slice(),
  position: vec3.zero.slice(),
  rotation: quat.create()
}

export class Transform extends Component {
  constructor(options) {
    super(Object.assign({
      matrix: mat4.create(),
      world: mat4.create(),
    },  default_options, options));
  }

  get self() {
    return mat4.invert(this.world);
  }

  get left() {
    let out = vec3.of(this.matrix.m11, this.matrix.m12, this.matrix.m13);
    return vec3.normalize(out, out);
  }

  get up() {
    let out = vec3.of(this.matrix.m21, this.matrix.m22, this.matrix.m23);
    return vec3.normalize(out, out);
  }

  get forward() {
    let out = vec3.of(this.matrix.m31, this.matrix.m32, this.matrix.m33);
    return vec3.normalize(out, out);
  }

  set position(vec) {
    mat4.compose(this.matrix, this.rotation, vec, this.scale);
  }

  get position() {
    return vec3.of(this.matrix.m41, this.matrix.m42, this.matrix.m43);
  }

  set scale(vec) {
    this._scale = vec;
    mat4.compose(this.matrix, this.rotation, this.position, vec);
  }

  get scale() {
    return this._scale;
  }

  set rotation(quaternion) {
    this._rotation = quaternion;
    mat4.compose(this.matrix, quaternion, this.position, this.scale);
  }

  get rotation() {
    return this._rotation;
  }

  look_at(target_position) {
    // Find the direction we're looking at. target_position must be given in
    // the current entity's coordinate space.  Use target's world and
    // the current entity's self to go from target's space to the
    // current entity space.
    let forward = vec3.zero.slice();
    vec3.subtract(forward, target_position, this.position);
    vec3.normalize(forward, forward);

    // Assume that the world's horizontal plane is the frame of reference for
    // the look_at rotations. This should be fine for most game cameras which
    // don't need to roll.

    // Find left by projecting forward onto the world's horizontal plane and
    // rotating it 90 degress counter-clockwise. For any (x, y, z), the rotated
    // vector is (z, y, -x).
    let left = vec3.of(forward[2], 0, -forward[0]);
    vec3.normalize(left, left);

    // Find up by computing the cross-product of forward and left according to
    // the right-hand rule.
    let up = vec3.zero.slice();
    vec3.cross(up, forward, left);

    // Create a quaternion out of the three axes. The vectors represent axes:
    // they are perpenticular and normalized.
    let rotation = quat.create();
    quat.set_axes(rotation, left, up, forward);

    this.rotation = rotation;
  }

  rotate_along(vec, rad) {
    let rotation = quat.create();
    quat.set_axis_angle(rotation, vec, rad);

    // Quaternion multiplication: A * B applies the A rotation first, B second,
    // relative to the coordinate system resulting from A.
    quat.multiply(rotation, this.rotation, rotation);
    this.rotation = rotation;
  }

  // XXX Add a relative_to attribute for interpreting the translation in spaces
  // other than the local space (relative to the parent).
  translate(vec) {
    let movement = vec3.zero.slice();
    vec3.add(movement, this.position, vec);
    this.position = movement;
  }

  get_view_matrix(out) {
    let look_at_vect = [];
    vec3.add(look_at_vect, this.position, this.forward);
    mat4.look_at(out, this.position, look_at_vect, this.up);
    return out;
  }

  update() {
    if (this.entity.parent) {
      this.world = mat4.multiply(
        this.entity.parent.get(Transform).world,
        this.matrix
      );
    } else {
      // We never modify the elements of the world matrix so it's OK to point it
      // to the local matrix for perf improvements.
      this.world = this.matrix;
    }
  }
}
