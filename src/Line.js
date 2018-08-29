export default
function Line(text) {
    // A deterministic digest function provides variety and ensures
    // subsequent renders given the same state produce the same output.
    let glitchIndex = text.length % 20;
    return html`
        <div class="line">
            <div class="glitch">
                <div class="white glitch${glitchIndex}">${text}</div>
                <div class="red glitch${glitchIndex}">${text}</div>
                <div class="blue glitch${glitchIndex}">${text}</div>
            </div>
        </div>
    `;
}
