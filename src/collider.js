import {Component} from "./cervus/core";
import {Transform} from "./cervus/components";
import {vec3} from "./cervus/math";
import Bounds from "./bounds";
import PowerUp from "./powerup";

export default
class Collider extends Component {
    mount() {
        this.transform = this.entity.get_component(Transform);
    }

    update() {
        let collidables = this.entity.game.components.get(Bounds);
        for (let bounds of collidables) {
            if (bounds.contains(this.transform.position)) {
                bounds.entity.get_component(PowerUp).trigger();
            }
        }
    }
}
