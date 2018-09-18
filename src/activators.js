import {Render, Light} from "./cervus/components";
import GridMove from "./grid-move";
import NearbyLight from "./nearbylight";
import * as sys from "./systems";
import {
    BUILDING_TAG,
    NEON_TAG,
    POWERUP_TAG,
    building_material,
    powerup_material,
    neon_material} from "./materials";
import {
    BUILDING_COLOR,
    POWERUP_COLOR} from "./config";
import {random_color} from "./color";

export default
function activate(game, system) {
    switch (system) {
        case sys.SOLID:
            for (let render of game.components.get(Render)) {
                switch (render.tag) {
                    case BUILDING_TAG:
                        render.material = building_material;
                        render.color = BUILDING_COLOR;
                        continue;
                    case NEON_TAG:
                        render.material = neon_material;
                        continue
                    case POWERUP_TAG:
                        render.material = powerup_material;
                }
            }
            break;
        case sys.COLOR:
            for (let render of game.components.get(Render)) {
                switch (render.tag) {
                    case BUILDING_TAG:
                        // Keep the current building color. It's either
                        // wireframe or set in SOLID; both of which look OK.
                        continue;
                    case NEON_TAG: {
                        let color = random_color();
                        render.set({color});
                        for (let child of render.entity.entities) {
                            child.get_component(NearbyLight).set({color});
                        }
                        continue;
                    }
                    case POWERUP_TAG: {
                        let color = POWERUP_COLOR;
                        render.set({color});
                        for (let child of render.entity.entities) {
                            child.get_component(Light).set({color});
                        }
                    }
                }
            }
            break;
        case sys.MOUSELOOK:
            game.camera.get_component(GridMove).set({
                mouse_controlled: true,
                rotate_speed: .5,
            });
            break;
        default:
            break;
    }
}
