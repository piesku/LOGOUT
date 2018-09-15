import {Component} from './cervus/core';
import {Transform} from './cervus/components';
import {vec3} from "./cervus/math";

export default
class Rotator extends Component {
    mount() {
        this.transform = this.entity.get_component(Transform);
    }

    update(delta) {
        this.transform.rotate_along(vec3.left, 0.0001 * delta);
        this.transform.rotate_along(vec3.up, 0.0002 * delta);
        this.transform.rotate_along(vec3.forward, 0.0003 * delta);
    }
}
