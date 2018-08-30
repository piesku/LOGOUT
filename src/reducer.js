const init = {
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
