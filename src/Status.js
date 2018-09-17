import Block from "./Block";
import * as sys from "./systems";

export function get_system_status(systems) {
    let system_status = [];
    for (let [sys, on] of Object.entries(systems)) {
        let status = on
            ? "Online"
            : "Offline";
        system_status.push(`${sys} = ${status}`);
    }
    return system_status;
}

export default
function Status(cls, styles, systems) {
    return Block(cls, [
        "Running analysis",
        ...get_system_status(systems),
        "<div class=e>Assessment complete</div>",
    ], styles);
}
