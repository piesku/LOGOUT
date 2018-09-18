import {Component} from "./innerself";
import {html} from "./store";
import Line from "./Line";
import {digest} from "./util";

export default
function Story(text) {
    return new class extends Component {
        before(root) {
            clearInterval(this.interval);
            root.removeEventListener("click", this.onclick);
        }

        after(root) {
            let div = document.createElement("div");
            let lines = text.split("\n")[Symbol.iterator]();
            let container = root.querySelector(".t");

            let update = () => {
                // Animate text display
                let next = lines.next();
                if (next.done) {
                    clearInterval(this.interval);
                } else {
                    div.innerHTML = Line(next.value);
                    container.appendChild(div.firstElementChild);
                }
            };

            this.onclick = () => {
                this.before(root);
                this.interval = setInterval(update, 100);
            };

            this.interval = setInterval(update, 1000);
            root.addEventListener("click", this.onclick);
        }

        render() {
            return html`
                <div class="m s">
                    <div class="t" digest="${digest(text)}"></div>
                </div>
            `;
        }
    }
}
