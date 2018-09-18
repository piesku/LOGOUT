import {Component} from "./cervus/core";
import {Light} from "./cervus/components";

export default
class NearbyLight extends Component {
    set(values) {
        super.set(values);
        if (this.active) {
            this.entity.get_component(Light).set(values);
        }
    }

    on() {
        this.active = true;
        let {color, intensity} = this;
        this.entity.add_component(new Light({
            color, intensity
        }));
    }

    off() {
        this.active = false;
        this.entity.remove_component(Light);
    }
}
