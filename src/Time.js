import {Component} from "./innerself";
import Block from "./Block";
import Glitch from "./Glitch";

const formatters = [
    // Weekday and Date
    new Intl.DateTimeFormat("en", {
        weekday: "short",
        month: "short",
        day: "2-digit",
        year: "numeric",
    }),
    // Time
    new Intl.DateTimeFormat("en", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
    })
];

export default function Time(cls, styles) {
    return new class extends Component {
        before(root) {
            clearInterval(this.interval);
        }

        after(root) {
            this.interval = setInterval(() => {
                // Update datetime
                let lines = root.querySelectorAll(`.${cls} .line`);
                let now = new Date();
                for (let [i, line] of lines.entries()) {
                    line.innerHTML = Glitch(formatters[i].format(now));
                }
            }, 1000);
        }

        render() {
            let now = new Date();
            return Block(cls, [
                formatters[0].format(now),
                formatters[1].format(now),
            ], styles);
        }
    }
}
