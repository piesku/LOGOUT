import {Component} from "./cervus/core";
import {Transform} from "./cervus/components";
import Bounds from "./bounds";
import PowerUp from "./powerup";
import Exit from "./exit";

export default
class Collider extends Component {
    mount() {
        this.transform = this.entity.get_component(Transform);
    }

    update() {
        let collidables = this.entity.game.components.get(Bounds);
        for (let bounds of collidables) {
            if (bounds.contains(this.transform.position)) {
                let entity = bounds.entity;
                if (entity.components.has(PowerUp)) {
                    entity.get_component(PowerUp).trigger();
                }
                if (entity.components.has(Exit)) {
                    entity.get_component(Exit).trigger();
                }
            }
        }
    }
}
