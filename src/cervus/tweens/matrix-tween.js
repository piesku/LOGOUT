import { Tween } from '../core';
import { mat4 } from '../math';

export class MatrixTween extends Tween {
  action() {
    for (let i = 1; i < 5; i++) {
      for (let j = 1; j < 5; j++) {
        let m = `m${i}${j}`;
        this.object[m] = this.from[m] + this.current_step * (this.to[m] - this.from[m]);
      }
    }
  }

  pre_start() {
    super.pre_start();
    this.from = mat4.clone(this.object);
  }
}
