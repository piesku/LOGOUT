import {html} from "./store";

export default
function Glitch(text) {
    // A deterministic digest function provides variety and ensures
    // subsequent renders given the same state produce the same output.
    let digest = [...text]
        .map(ch => ch.codePointAt(0))
        .reduce((acc, cur) => acc + cur, 0);
    let glitch_index = digest % 20;
    return html`
        <div class="glitch">
            <div class="glitch1 noise${glitch_index}">${text}</div>
            <div class="glitch2 noise${glitch_index}">${text}</div>
            <div class="glitch3 noise${glitch_index}">${text}</div>
        </div>
    `;
}

export function set_glitch(line, text) {
    for (let glitchPart of line.querySelectorAll(".glitch > div")) {
        glitchPart.textContent = text;
    }
}
