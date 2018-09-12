import {Component} from "./innerself";
import {html} from "./store";
import Line from "./Line";

export default
function Story(text) {
    return new class extends Component {
        before(root) {
            clearInterval(this.interval);
        }

        after(root) {
            let div = document.createElement("div");
            let lines = text.split("\n")[Symbol.iterator]();
            let container = root.querySelector(".text");

            this.interval = setInterval(() => {
                // Animate text display
                let next = lines.next();
                if (next.done) {
                    clearInterval(this.interval);
                } else {
                    div.innerHTML = Line(next.value);
                    container.appendChild(div.firstElementChild);
                }
            }, 1000);
            // }, 1);
        }

        render() {
            return html`
                <div class="screen story">
                    <div class="text"></div>
                </div>
            `;
        }
    }
}
