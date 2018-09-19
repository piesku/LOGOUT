import {Component} from "./cervus/core";
import {Transform} from "./cervus/components";
import {vec3} from "./cervus/math";
import NearbyLight from "./nearbylight";
import {LIGHT_DISTANCE, BUILDING_FOG_MAX} from "./config";

export default
class EnergySaver extends Component {
    update() {
        let transform = this.entity.get(Transform);
        let position = transform.world.slice(12, 15);

        let lights = this.entity.game.all.get(NearbyLight);
        for (let light of lights) {
            let light_transform = light.entity.get(Transform);
            let light_position = light_transform.world.slice(12, 15);
            let dist = vec3.distance(position, light_position);

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
