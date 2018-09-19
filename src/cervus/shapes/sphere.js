import { Entity } from '../core';

import { Render } from '../components';
import { Transform } from '../components';

let t = 0.5 + Math.sqrt(5) / 2;
let vertices = [
  -1, t,  0,
  1, t,  0,
  -1, -t,  0,
  1, -t,  0,
  0, -1, t,
  0, 1, t,
  0, -1, -t,
  0, 1, -t,
  t,  0, -1,
  t,  0, 1,
  -t,  0, -1,
  -t,  0, 1
];

let normals = [
  -1, t,  0,
  1, t,  0,
  -1, -t,  0,
  1, -t,  0,
  0, -1, t,
  0, 1, t,
  0, -1, -t,
  0, 1, -t,
  t,  0, -1,
  t,  0, 1,
  -t,  0, -1,
  -t,  0, 1
];

let indices = [
  0, 11, 5,
  0, 5, 1,
  0, 1, 7,
  0, 7, 10,
  0, 10, 11,
  1, 5, 9,
  5, 11, 4,
  11, 10, 2,
  10, 7, 6,
  7, 1, 8,
  3, 9, 4,
  3, 4, 2,
  3, 2, 6,
  3, 6, 8,
  3, 8, 9,
  4, 9, 5,
  2, 4, 11,
  6, 2, 10,
  8, 6, 7,
  9, 8, 1
];

let uvs = [
  0.5881, 0.5,
  0.75, 0.6762,
  0.5, 0.8237,
  0.75, 0.6762,
  1, 0.8237,
  0.5, 0.8237,
  0, 0.8237,
  0.25, 0.6762,
  0.5, 0.8237,
  0.25, 0.6762,
  0.4118, 0.5,
  0.5, 0.8237,
  0.4118, 0.5,
  0.5881, 0.5,
  0.5, 0.8237,
  0.75, 0.6762,
  0.9118, 0.5,
  1, 0.8237,
  0.5881, 0.5,
  0.75, 0.3237,
  0.75, 0.6762,
  0.4118, 0.5,
  0.5, 0.1762,
  0.5881, 0.5,
  0.25, 0.6762,
  0.25, 0.3237,
  0.4118, 0.5,
  0, 0.8237,
  0.0881, 0.5,
  0.25, 0.6762,
  0.9118, 0.5,
  0.75, 0.3237,
  1, 0.1762,
  0.75, 0.3237,
  0.5, 0.1762,
  1, 0.1762,
  0.5, 0.1762,
  0.25, 0.3237,
  0, 0.1762,
  0.25, 0.3237,
  0.0881, 0.5,
  0, 0.1762,
  1.0881, 0.5,
  0.9118, 0.5,
  1, 0.1762,
  0.9118, 0.5,
  0.75, 0.6762,
  0.75, 0.3237,
  0.75, 0.3237,
  0.5881, 0.5,
  0.5, 0.1762,
  0.5, 0.1762,
  0.4118, 0.5,
  0.25, 0.3237,
  0.25, 0.3237,
  0.25, 0.6762,
  0.0881, 0.5,
  1.0881, 0.5,
  1, 0.8237,
  0.9118, 0.5
];
export class Sphere extends Entity {
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
  // TODO: https://github.com/hughsk/icosphere/blob/master/index.js
}
