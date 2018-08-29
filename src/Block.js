import Line from "./Line";

export default
function Block(area, lines, {align = "stretch", justify = "stretch"} = {}) {
    return html`
        <div class="block ${area}"
            style="grid-area: ${area}; align-self: ${align}; justify-self: ${justify};">
            ${lines.map(Line)}
        </div>
    `;
}
