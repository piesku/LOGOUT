function render(phase, component) {
    if (component instanceof Component) {
        let output = component.render();

        switch (phase) {
            case "BEFORE":
                return component.before();
            case "AFTER":
                return component.after();
            default:
                return output;
        }
    }

    // All other types are handled in html.
    return component;
}

export class Component {
    before() {}
    render() {}
    after() {}
}

function html(phase, [first, ...strings], ...values) {
    // Weave the literal strings and the interpolations.
    // We don't have to explicitly handle array-typed values
    // because concat will spread them flat for us.
    return values.reduce(
        (acc, cur) => acc.concat(render(phase, cur), strings.shift()),
        [first])

        // Filter out interpolations which are bools, null or undefined.
        .filter(x => x && x !== true || x === 0)
        .join("");
}

export function createStore(reducer) {
    let state = reducer();
    let phase = "RENDER";
    const roots = new Map();
    const prevs = new Map();

    function renderRoots() {
        for (const [root, component] of roots) {
            const output = render(phase = "RENDER", component());

            // Compare the new output with the last output for this root.
            // Don't trust the current value of root.innerHTML as it may have
            // been changed by other scripts or extensions.
            if (output !== prevs.get(root)) {
                render(phase = "BEFORE", component());

                // Render the output of the component to DOM and cache it.
                prevs.set(root, root.innerHTML = output);

                render(phase = "AFTER", component());
            }
        }
    };

    return {
        attach(component, root) {
            roots.set(root, component);
            renderRoots();
            return root;
        },
        connect(component) {
            // Return a decorated component function.
            return (...args) => component(state, ...args);
        },
        dispatch(action, ...args) {
            state = reducer(state, action, args);
            renderRoots();
        },
        html(...args) {
            return html(phase, ...args);
        },
    };
}
