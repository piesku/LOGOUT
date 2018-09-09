import * as systems from "./systems";
import create_game from "./game";

const init = {
    view: "intro",
    game: null,
    lastActive: systems.PERSPECTIVE,
    systems: {
        [systems.PERSPECTIVE]: true,
        [systems.GRID]: true,
        [systems.HUD]: false,
        [systems.MOUSELOOK]: false,
        [systems.COLORS]: false,
        [systems.COMPASS]: false,
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
