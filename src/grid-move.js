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
        this.size = 0.5;
    }
    mount() {
        this.transform = this.entity.components.get(Transform);
        this.buildings = window.bul = this.entity.game.buildings;
        this.last_position = this.transform.position;
    }

    is_colliding() {
        const { position } = this.transform;
        return this.buildings.some((building) => {
            if (position[0] + this.size >= building[0] &&
                position[0] - this.size <= building[1] &&
                position[2] + this.size >= building[2] &&
                position[2] - this.size <= building[3]) {
                return true;
            }
            return false;
        });
    }
    update(delta) {
        this.tick++;

        if (this.is_colliding()) {
            this.transform.position = this.last_position;
        } else {
            if (this.tick % 10 === 0) {
                this.last_position = this.transform.position;
            }
            super.update(delta);
        }
    }
}
