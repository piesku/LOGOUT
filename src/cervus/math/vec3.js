let V = Float32Array;

export {
  distance,
  normalize,
  subtract,
  add,
  scale,
  cross,
  angle,
  lerp
} from 'gl-matrix/src/gl-matrix/vec3';

export let zero = V.of(0, 0, 0);
export let unit = V.of(1, 1, 1);
export let left = V.of(1, 0, 0);
export let up = V.of(0, 1, 0);
export let forward = V.of(0, 0, 1);

export let of = (...vals) => V.of(...vals);

export function transform_mat4(out, vec, mat) {
  let [x, y, z] = vec;
  let res = mat.transformPoint({x, y, z});
  out[0] = res.x;
  out[1] = res.y;
  out[2] = res.z;
  return out;

}
