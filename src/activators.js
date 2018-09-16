import {element_of} from "./cervus/core";
import {Light, Move, Render} from "./cervus/components";
import * as sys from "./systems";
import {
    BUILDING_TAG,
    NEON_TAG,
    INTERACTABLE_TAG,
    building_material,
    neon_material} from "./materials";
import {
    BUILDING_COLOR,
    NEON_COLORS,
    POWERUP_COLOR} from "./config";

export default
function activate(game, system) {
    switch (system) {
        case sys.SOLID:
            for (let entity of game.get_entities_by_component(Render)) {
                let render = entity.get_component(Render);
                switch (render.tag) {
                    case BUILDING_TAG:
                        render.material = building_material;
                        render.color = BUILDING_COLOR;
                        continue;
                    case NEON_TAG:
                    case INTERACTABLE_TAG:
                        render.material = neon_material;
                }
            }
            break;
        case sys.COLOR:
            for (let entity of game.get_entities_by_component(Render)) {
                let render = entity.get_component(Render);
                switch (render.tag) {
                    case BUILDING_TAG:
                        render.color = BUILDING_COLOR;
                        continue;
                    case NEON_TAG: {
                        let color = element_of(NEON_COLORS);
                        render.set({color});
                        for (let child of entity.entities) {
                            child.get_component(Light).set({color});
                        }
                        continue;
                    }
                    case INTERACTABLE_TAG: {
                        let color = POWERUP_COLOR;
                        render.set({color});
                        for (let child of entity.entities) {
                            child.get_component(Light).set({color});
                        }
                    }
                }
            }
            break;
        case sys.MOUSELOOK:
            game.camera.get_component(Move).set({
                mouse_controlled: true,
                rotate_speed: .5,
            });
            break;
        default:
            break;
    }
}
