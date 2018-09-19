import {Component} from "./cervus/core";
import {Transform} from "./cervus/components";
import {vec3} from "./cervus/math";

export default
class Trigger extends Component {
    mount() {
        this.transform = this.entity.get(Transform);
    }

    contains(world_point) {
        // Point in self space.
        let point = vec3.zero.slice();
        vec3.transform_mat4(
            point, world_point, this.transform.self);
        // XXX How to parametrize each shape?
        return point.map(Math.abs).every(n => n <= this.radius);
    }

    trigger() {
        this.entity.game.remove(this.entity);
        dispatch(...this.action);
    }
}
