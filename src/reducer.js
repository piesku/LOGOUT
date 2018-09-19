import * as sys from "./systems";
import * as act from "./actions";
import {create_game, destroy_game, reveal_exit} from "./game";
import activate from "./activators";

let init = {
    view: "intro",
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
                last: sys.HUD,
                systems: Object.assign({}, state.systems, {
                    [sys.HUD]: true
                })
            });
        case act.ACTIVATE: {
            let [last] = args;
            activate(game, last);

            let systems_all = [...Object.values(state.systems)];
            let systems_active = systems_all.filter(x => x);
            // If this is the last system, reveal the exit.
            if (systems_all.length - systems_active.length === 1) {
                reveal_exit(game);
            }

            return Object.assign({}, state, {
                last,
                systems: Object.assign({}, state.systems, {
                    [last]: true
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
