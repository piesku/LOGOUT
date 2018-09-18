export class Component {
    before() {}
    render() {}
    after() {}
}

export default function(reducer) {
    let state = reducer();

    let phase;
    let root;
    let app;

    function renderComponent(component) {
        if (component instanceof Component) {
            let output = component.render();
            switch (phase) {
                case "BEFORE":
                    return component.before(root);
                case "AFTER":
                    return component.after(root);
                default:
                    return output;
            }
        }

        // All other types are handled in html.
        return component;
    }


    function renderRoots(nextState) {
        let prevState = state;

        phase = "BEFORE";
        state = prevState;
        renderComponent(app());

        phase = "RENDER";
        state = nextState;
        root.innerHTML = renderComponent(app());

        phase = "AFTER";
        state = nextState;
        renderComponent(app());
    };

    return {
        attach(_app, _root) {
            root = _root;
            app = _app;
            renderRoots(state);
        },
        connect(component) {
            // Return a decorated component function.
            return (...args) => component(state, ...args);
        },
        dispatch(action, ...args) {
            let nextState = reducer(state, action, args);
            renderRoots(nextState);
        },
        html([first, ...strings], ...values) {
            // Weave the literal strings and the interpolations.
            // We don't have to explicitly handle array-typed values
            // because concat will spread them flat for us.
            return values.reduce(
                (acc, cur) =>
                    acc.concat(
                        renderComponent(cur),
                        strings.shift()),
                [first])

                // Filter out interpolations which are bools, null or undefined.
                .filter(x => x && x !== true || x === 0)
                .join("");
        },
    };
}
