import { Move } from "./cervus/components";
import {Transform} from "./cervus/components";
// import {vec3} from "./cervus/math";

export default
class GridMove extends Move {
    constructor() {
        super();
        delete this.dir_desc[69];
        delete this.dir_desc[81];
        this.tick = 0;
    }
    mount() {
        this.transform = this.entity.get(Transform);
        this.last = this.transform.position;
    }

    is_colliding() {
        let padding = 0.5;
        let { position: [x,, z] } = this.transform;

        for (let building of this.buildings) {
            if (x + padding >= building[0] &&
                x - padding <= building[1] &&
                z + padding >= building[2] &&
                z - padding <= building[3]) {
                return true;
            }
        }

        if (x < 0 || x > this.size[0] || z < 0 || z > this.size[1]) {
            return true;
        }
    }
    update(delta) {
        this.tick++;

        if (this.is_colliding()) {
            this.transform.position = this.last;
        } else {
            if (this.tick % 10 === 0) {
                this.last = this.transform.position;
            }
            super.update(delta);
        }
    }
}
