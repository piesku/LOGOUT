export class Component {
    before() {}
    render() {}
    after() {}
}

export default function(reducer) {
    let state = reducer();
    let roots = new Map();
    let prevs = new Map();

    let phase;
    let root;

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
        for (let [_root, component] of roots) {
            root = _root;

            phase = "RENDER";
            state = nextState;
            let output = renderComponent(component());

            // Compare the new output with the last output for this root.
            // Don't trust the current value of root.innerHTML as it may have
            // been changed by other scripts or extensions.
            if (output !== prevs.get(root)) {
                phase = "BEFORE";
                state = prevState;
                renderComponent(component());

                // Render the output of the component to DOM and cache it.
                root.innerHTML = output;
                prevs.set(root, output);

                phase = "AFTER";
                state = nextState;
                renderComponent(component());
            }
        }
    };

    return {
        attach(component, root) {
            roots.set(root, component);
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
