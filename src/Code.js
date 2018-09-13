import {Component} from "./innerself";
import Block from "./Block";
import Line from "./Line";
import code_anim from "./anim_code";

export default function Code(cls, styles) {
    return new class extends Component {
        before(root) {
            clearInterval(this.interval);
        }

        after(root) {
            let div = document.createElement("div");
            let container = root.querySelector(`.${cls}`);

            this.interval = setInterval(() => {
                // Animate code display
                container.removeChild(container.firstElementChild);
                div.innerHTML = Line(code_anim.next().value);
                container.appendChild(div.firstElementChild);
            }, 1000);
        }

        render() {
            return Block(
                cls,
                new Array(10).fill(""),
                styles
            );
        }
    }
}
