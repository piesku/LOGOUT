function html([first, ...strings], ...values) {
    // Weave the literal strings and the interpolations.
    // We don't have to explicitly handle array-typed values
    // because concat will spread them flat for us.
    return values.reduce(
        (acc, cur) => acc.concat(cur, strings.shift()),
        [first])

        // Filter out interpolations which are bools, null or undefined.
        .filter(x => x && x !== true || x === 0)
        .join("");
}

function createStore(reducer) {
    let state = reducer();
    const roots = new Map();
    const prevs = new Map();

    function render() {
        for (const [root, component] of roots) {
            const output = component();

            // Compare the new output with the last output for this root.
            // Don't trust the current value of root.innerHTML as it may have
            // been changed by other scripts or extensions.
            if (output !== prevs.get(root)) {
                // Clean up listeners before the DOM is destroyed.
                root.dispatchEvent(
                    new CustomEvent("beforerender", {detail: state}));

                // Render the output of the component to DOM and cache it.
                prevs.set(root, root.innerHTML = output);

                // Dispatch an event on the root to give developers a chance to
                // do some housekeeping after the whole DOM is replaced under
                // the root. You can re-focus elements in the listener to this
                // event. See example03.
                root.dispatchEvent(
                    new CustomEvent("afterrender", {detail: state}));
            }
        }
    };

    return {
        attach(component, root) {
            roots.set(root, component);
            render();
            return root;
        },
        connect(component) {
            // Return a decorated component function.
            return (...args) => component(state, ...args);
        },
        dispatch(action, ...args) {
            state = reducer(state, action, args);
            render();
        },
    };
}
