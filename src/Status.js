import Block from "./Block";
import * as sys from "./systems";

export default
function Status(cls, styles, systems) {
    let systems_status = [];
    for (let [sys, on] of Object.entries(systems)) {
        let status = on
            ? "Online"
            : "Offline";
        systems_status.push(`${sys} = ${status}`);
    }
    return Block(cls, [
        "Running analysis",
        ...systems_status,
        "<div class=box>Assessment complete</div>",
    ], styles);
}
