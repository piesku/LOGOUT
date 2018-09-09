import {Component} from "./innerself";
import Block from "./Block";
import Glitch from "./Glitch";

export default function Time(cls, styles) {
    return new class extends Component {
        before(root) {
            clearInterval(this.interval);
        }

        after(root) {
            this.interval = setInterval(() => {
                // Update datetime
                let line = root.querySelector(`.${cls} .line`);
                line.innerHTML = Glitch((new Date()).toString());
            }, 1000);
        }

        render() {
            return Block(
                cls,
                [(new Date()).toString()],
                styles
            );
        }
    }
}
