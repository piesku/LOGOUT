import {html} from "./store";

export default
function Glitch(text) {
    // A deterministic digest function provides variety and ensures
    // subsequent renders given the same state produce the same output.
    let glitchIndex = text.length % 20;
    return html`
        <div class="glitch">
            <div class="glitch1 noise${glitchIndex}">${text}</div>
            <div class="glitch2 noise${glitchIndex}">${text}</div>
            <div class="glitch3 noise${glitchIndex}">${text}</div>
        </div>
    `;
}

export function set_glitch(line, text) {
    for (let glitchPart of line.querySelectorAll(".glitch > div")) {
        glitchPart.textContent = text;
    }
}
