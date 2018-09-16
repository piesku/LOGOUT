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
        let collidables = this.entity.game.get_entities_by_component(Bounds);
        for (let entity of collidables) {
            let bounds = entity.get_component(Bounds);
            if (bounds.contains(this.transform.position)) {
                entity.get_component(PowerUp).activate();
            }
        }
    }
}
