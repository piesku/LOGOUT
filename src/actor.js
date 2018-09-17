import {Component} from "./cervus/core";
import {Transform} from "./cervus/components";
import Trigger from "./trigger";

export default
class Actor extends Component {
    mount() {
        this.transform = this.entity.get_component(Transform);
    }

    update() {
        let collidables = this.entity.game.components.get(Trigger);
        for (let trigger of collidables) {
            if (trigger.contains(this.transform.position)) {
                trigger.trigger();
            }
        }
    }
}
