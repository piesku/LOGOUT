import {html} from "./store";
import Glitch from "./Glitch";

export default
function Line(text) {
    return html`
        <div class="l">
            ${Glitch(text)}
        </div>
    `;
}
