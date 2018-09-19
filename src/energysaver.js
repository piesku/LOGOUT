import {Component} from "./cervus/core";
import {Transform} from "./cervus/components";
import {vec3} from "./cervus/math";
import NearbyLight from "./nearbylight";
import {LIGHT_DISTANCE, BUILDING_FOG_MAX} from "./config";

function world_pos(world_matrix) {
    return vec3.of(
        world_matrix.m41,
        world_matrix.m42,
        world_matrix.m43,
    );
}

export default
class EnergySaver extends Component {
    update() {
        let transform = this.entity.get(Transform);

        let lights = this.entity.game.all.get(NearbyLight);
        for (let light of lights) {
            let light_transform = light.entity.get(Transform);
            let dist = vec3.distance(
                world_pos(transform.world),
                world_pos(light_transform.world));

            if (dist > LIGHT_DISTANCE && light.active) {
                light.off();
                continue;
            }

            if (dist <= LIGHT_DISTANCE && !light.active) {
                light.on();
            }
        }
    }
}
