import { Entity } from '../core';

import { Render } from '../components';
import { Transform } from '../components';

let vertices = [
  -1,  0,  1,
   1,  0,  1,
   1, 0,  -1,
  -1, 0,  -1
];

let indices = [
   0,  1,  3,
   3,  1,  2
];

let normals = [
  0, 1, 0,
  0, 1, 0,
  0, 1, 0,
  0, 1, 0
];

let uvs = [
  1, 0,
  0, 0,
  0, 1,
  1, 1
];

export class Plane extends Entity {
  constructor(options = {}) {
    options.components = [
      new Transform(),
      new Render({
        vertices,
        indices,
        normals,
        uvs,
        material: options.material
      })
    ];

    super(options);
  }
}
