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
            this.entity.get(Light).set(values);
        }
    }

    on() {
        this.active = true;
        let {color, intensity} = this;
        this.entity.attach(new Light({
            color, intensity
        }));
        // this.entity.attach(this.gizmo);
    }

    off() {
        this.active = false;
        this.entity.detach(Light);
        // this.entity.detach(Object.getPrototypeOf(this.gizmo));
    }
}
