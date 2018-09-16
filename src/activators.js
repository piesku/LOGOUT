import {Render} from "./cervus/components";
import * as sys from "./systems";
import {
    BUILDING_TAG,
    NEON_TAG,
    INTERACTABLE_TAG,
    building_material,
    neon_material} from "./materials";
import {BUILDING_COLOR} from "./config";

export default
function activate(game, system) {
    switch (system) {
        case sys.SOLID: {
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
                    default:
                        continue;
                }
            }
        }
        default:
            return;
    }
}
