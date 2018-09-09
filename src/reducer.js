import * as sys from "./systems";
import create_game from "./game";

const init = {
    view: "intro",
    game: null,
    lastActive: sys.PERSPECTIVE,
    systems: {
        [sys.PERSPECTIVE]: true,
        [sys.GRID]: true,
        [sys.HUD]: false,
        [sys.MOUSELOOK]: false,
        [sys.COLORS]: false,
        [sys.COMPASS]: false,
    },
};

export default
function reducer(state = init, action, args) {
    switch (action) {
        case "START": {
            return Object.assign({}, state, {
                view: "playing",
                game: create_game(),
            });
        }
        case "ACTIVATE": {
            let [lastActive] = args;
            return Object.assign({}, state, {
                lastActive,
                systems: Object.assign({}, state.systems, {
                    [lastActive]: true
                })
            });
        }
        default:
            return state;
    }
}
