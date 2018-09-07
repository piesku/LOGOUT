import create_game from "./game";

const init = {
    view: "intro",
    game: null,
    lastActive: "Power Fallback",
    systems: {
        "Power Fallback": "Online",
        "Grid Movement": "Online",
        "Perspective": "Offline",
        "Enhanced DoF": "Offline",
        "Chromatic Vision": "Offline",
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
                    [lastActive]: "Online"
                })
            });
        }
        default:
            return state;
    }
}
