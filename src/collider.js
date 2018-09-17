import {Component} from "./cervus/core";
import {Transform} from "./cervus/components";
import Bounds from "./bounds";

export default
class Collider extends Component {
    mount() {
        this.transform = this.entity.get_component(Transform);
    }

    update() {
        let collidables = this.entity.game.components.get(Bounds);
        for (let bounds of collidables) {
            if (bounds.contains(this.transform.position)) {
                bounds.trigger();
            }
        }
    }
}
