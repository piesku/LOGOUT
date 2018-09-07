import {Component} from "./innerself";
import {connect, html} from "./store";
import Block from "./Block";
import Line from "./Line";
import "./anim_glitch";

const text = `
LOGOUT

First paragraph.
Continued.

Second paragraph.
More text here.

<button onclick="dispatch('START')">Find exit</button>
`;

function Intro({lastActive, systems}) {
    return new class extends Component {
        before(root) {
            clearInterval(this.interval);
        }

        after(root) {
            let div = document.createElement("div");
            let lines = text.split("\n")[Symbol.iterator]();
            this.interval = setInterval(() => {
                // Animate text display
                let middle = root.querySelector(".mm");
                let next = lines.next();
                if (next.done) {
                    clearInterval(this.interval);
                } else {
                    div.innerHTML = Line(next.value);
                    middle.appendChild(div.firstElementChild);
                }
            }, 1000);
        }

        render() {
            return html`
                <div class="screen layout">
                    ${Block("mm")}
                </div>
            `;
        }
    }
}

export default connect(Intro);
