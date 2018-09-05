import {html} from "./store";
import Line from "./Line";

export default
function Block(area, lines, {align = "stretch", justify = "stretch", cls = ""} = {}) {
    return html`
        <div class="block ${area} ${cls}"
            style="grid-area: ${area}; align-self: ${align}; justify-self: ${justify};">
            ${lines.map(Line)}
        </div>
    `;
}
