import {Component} from "./cervus/core";
import {Light} from "./cervus/components";
// import create_gizmo from "./gizmo";

export default
class NearbyLight extends Component {
    // mount() {
    //     this.gizmo = create_gizmo();
    // }

    set(values) {
        super.set(values);
        if (this.active) {
            this.entity.components.get(Light).set(values);
        }
    }

    on() {
        this.active = true;
        let {color, intensity} = this;
        this.entity.add_component(new Light({
            color, intensity
        }));
        // this.entity.add_component(this.gizmo);
    }

    off() {
        this.active = false;
        this.entity.remove_component(Light);
        // this.entity.remove_component(Object.getPrototypeOf(this.gizmo));
    }
}
