import {Component} from "./innerself";
import {connect, html} from "./store";
import Block from "./Block";
import Line from "./Line";
import "./anim_glitch";

// No more than 55 chars per line.
// Any HTML must be on a single line.
const text = `
<div class="big">LOGOUT</div>

In 2018, people live their lives in virtual reality.
Most spent their entire lives in community clusters
assigned to them at birth. More lucky ones migrate
to premium clusters which boast 99,999% uptime.

You are not one of the lucky ones.

The community VR cluster you've spent your life in
has had a critical failure. The reboot has reset
the entire world.

Most systems are still offline but there should be
a way to bring them up online.

Find the exit and log out into the reality.

<button onclick="dispatch('START')">Initiate recovery sequence</button>
`;

function Intro({lastActive, systems}) {
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

export default connect(Intro);
