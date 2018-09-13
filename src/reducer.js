import * as sys from "./systems";
import * as act from "./actions";
import create_game from "./game";

const init = {
    view: "intro",
    game: null,
    last_active: null,
    systems: {
        [sys.CAMERA]: false,
        [sys.PERSPECTIVE]: false,
        [sys.HUD]: false,
        [sys.COLORS]: false,
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
            return Object.assign({}, state, {
                view: "playing",
                game: create_game(),
                last_active: sys.CAMERA,
                systems: Object.assign({}, state.systems, {
                    [sys.CAMERA]: true
                })
            });
        case act.ACTIVATE: {
            let [last_active] = args;
            return Object.assign({}, state, {
                last_active,
                systems: Object.assign({}, state.systems, {
                    [last_active]: true
                })
            });
        }
        default:
            return state;
    }
}
