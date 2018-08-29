const init = {
    lastActive: "Power Fallback",
};

export default
function reducer(state = init, action, args) {
    switch (action) {
        case "ACTIVATE": {
            let [lastActive] = args;
            return Object.assign({}, state, {lastActive});
        }
        default:
            return state;
    }
}
