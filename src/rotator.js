import {Component} from "./cervus/core";
import {Transform} from "./cervus/components";
import {vec3} from "./cervus/math";

export default
class Rotator extends Component {
    mount() {
        this.transform = this.entity.get(Transform);
    }

    update(delta) {
        let [x, y, z] = this.speed;
        this.transform.rotate_along(vec3.left, x * delta);
        this.transform.rotate_along(vec3.up, y * delta);
        this.transform.rotate_along(vec3.forward, z * delta);
    }
}
