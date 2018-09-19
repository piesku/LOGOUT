import {Component} from "./cervus/core";
import {Transform} from "./cervus/components";
import Trigger from "./trigger";

export default
class Actor extends Component {
    mount() {
        this.transform = this.entity.get(Transform);
    }

    update() {
        let collidables = this.entity.game.all.get(Trigger);
        for (let trigger of collidables) {
            if (trigger.contains(this.transform.position)) {
                trigger.trigger();
            }
        }
    }
}
