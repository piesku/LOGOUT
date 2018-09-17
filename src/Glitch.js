import {html} from "./store";
import {digest} from "./util";

export default
function Glitch(text) {
    // A deterministic digest function provides variety and ensures
    // subsequent renders given the same state produce the same output.
    let i = digest(text) % 20;
    return html`
        <div class="g">
            <div class="g1 n${i}">${text}</div>
            <div class="g2 n${i}">${text}</div>
            <div class="g3 n${i}">${text}</div>
        </div>
    `;
}

export function set_glitch(line, text) {
    for (let glitchPart of line.querySelectorAll(".g > div")) {
        glitchPart.textContent = text;
    }
}
