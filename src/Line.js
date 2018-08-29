export default
function Line(text) {
    // A deterministic digest function provides variety and ensures
    // subsequent renders given the same state produce the same output.
    let glitchIndex = text.length % 20;
    return html`
        <div class="line">
            <div class="glitch">
                <div class="glitch1 noise${glitchIndex}">${text}</div>
                <div class="glitch2 noise${glitchIndex}">${text}</div>
                <div class="glitch3 noise${glitchIndex}">${text}</div>
            </div>
        </div>
    `;
}
