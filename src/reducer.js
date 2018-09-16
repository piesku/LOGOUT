import * as sys from "./systems";
import * as act from "./actions";
import create_game from "./game";
import activate from "./activators";

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
            return Object.assign({}, state, {
                last_active,
                systems: Object.assign({}, state.systems, {
                    [last_active]: true
                })
            });
        }
        case act.EXIT:
            state.game.stop();
            state.game.canvas.remove();
            return Object.assign({}, state, {
                view: "outro",
            });
        default:
            return state;
    }
}
