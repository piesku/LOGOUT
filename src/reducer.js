import * as sys from "./systems";
import * as act from "./actions";
import {create_game, destroy_game} from "./game";
import {create_exit} from "./creators";
import activate from "./activators";
import map from "./map.json";

const init = {
    view: "intro",
    game: null,
    last_active: null,
    systems: {
        [sys.HUD]: false,
        [sys.PERSPECTIVE]: false,
        [sys.SOLID]: false,
        [sys.COLOR]: false,
        [sys.CLOCK]: false,
        [sys.COMPASS]: false,
        [sys.MOUSELOOK]: false,
        [sys.GRID]: true,
    },
};

export default
function reducer(state = init, action, args) {
    switch (action) {
        case act.DIAGNOSTIC:
            return Object.assign({}, state, {
                view: "diag",
            });
        case act.START:
            document.body.requestPointerLock()
            return Object.assign({}, state, {
                view: "play",
                game: create_game(),
                last_active: sys.HUD,
                systems: Object.assign({}, state.systems, {
                    [sys.HUD]: true
                })
            });
        case act.ACTIVATE: {
            let [last_active] = args;
            activate(game, last_active);

            let systems_all = [...Object.values(state.systems)];
            let systems_active = systems_all.filter(x => x);
            // If this is the last system, reveal the exit.
            if (systems_all.length - systems_active.length === 1) {
                game.add(create_exit({
                    position: [
                        map.starting_point.x,
                        63,
                        map.starting_point.y],
                    scale: [12, 126, 12],
                }));
            }

            return Object.assign({}, state, {
                last_active,
                systems: Object.assign({}, state.systems, {
                    [last_active]: true
                })
            });
        }
        case act.EXIT:
            document.exitPointerLock();
            destroy_game(state.game);
            return Object.assign({}, state, {
                view: "outro",
            });
        default:
            return state;
    }
}
