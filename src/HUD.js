import { Component } from "./innerself";
import { connect, html } from "./store";
import Block from "./Block";
import Line from "./Line";
import Glitch, {set_glitch} from "./Glitch";
import code_anim from "./anim_code";
import "./anim_glitch";
import { angle } from 'gl-matrix/src/gl-matrix/vec3';

let compass = "NW ---- N ---- NE ---- E ---- SE ---- S ---- SW ---- W ---- ";
let compass_length = compass.length;
compass = compass + compass + compass;
let step = (Math.PI * 2) / compass_length;
let visible_characters = 18;

function HUD({game, lastActive, systems}) {
    return new class extends Component {
        constructor() {
            super();
            this.nf = new Intl.NumberFormat("en", {
                minimumFractionDigits: 3,
                maximumFractionDigits: 3
            });
        }

        before(root) {
            clearInterval(this.interval);
        }

        after(root) {
            this.interval = setInterval(() => {
                let div = document.createElement("div");

                // Animate code display
                let br = root.querySelector(".br");
                br.removeChild(br.firstElementChild);
                div.innerHTML = Line(code_anim.next().value);
                br.appendChild(div.firstElementChild);

                // Update datetime
                let tr = root.querySelector(".tr .line");
                tr.innerHTML = Glitch((new Date()).toString());
            }, 1000);

            game.on("afterrender", () => {
                // Update local matrix display
                let bl = root.querySelector(".bl");
                let matrix = game.camera.get_component(Cervus.components.Transform).matrix;
                let values = [
                    [matrix[0], matrix[4], matrix[8], matrix[12]],
                    [matrix[1], matrix[5], matrix[9], matrix[13]],
                    [matrix[2], matrix[6], matrix[10], matrix[14]],
                    [matrix[3], matrix[7], matrix[11], matrix[15]]
                ];

                // Skip the header.
                let rows = [...bl.querySelectorAll(".line")].slice(1);
                for (let [i, line] of rows.entries()) {
                    set_glitch(
                        line,
                        values[i].map(n => this.nf.format(n)).join(" "));
                }

                let tm = root.querySelector(".tm");
                let forward = game.camera.get_component(Cervus.components.Transform).forward;
                let sign = forward[0] > 0 ? -1 : 1;
                let start = Math.round(angle([0, 0, 1], forward) / step) * sign;
                let section = (compass + compass + compass).slice(compass_length + start, compass_length + start + visible_characters);
                set_glitch(tm, section);
            });
        }

        render() {
            let systems_status = [];
            for (let [sys, on] of Object.entries(systems)) {
                let status = on
                    ? "Online"
                    : "Offline";
                systems_status.push(`${sys} = ${status}`);
            }
            return html`
                <div class="screen hud">
                    ${Block("tl", [
                        "Running analysis",
                        ...systems_status,
                        "<div class=box>Assessment complete</div>",
                    ])}

                    ${Block("tm", [
                        "N ----- NE ----- E",
                    ], { justify: "center" })}

                    ${Block("tr", [
                        (new Date()).toString()
                    ], { justify: "end" })}

                    ${Block("mm", [
                        lastActive,
                        "<div class='box big'>Activated</div>",
                    ], { align: "center", justify: "center", cls: "flicker" })}

                    ${Block("mr", [
                        "Active objectives",
                        "> 01. Enhance capabilities",
                        "> 02. Locate exit",
                        "> 03. Init logout sequence",
                    ])}

                    ${Block("bl", [
                        // Use empty lines of differnt length to use different
                        // glitch animations.
                        "Avatar entity matrix", "", " ", "  ", "   "
                    ], { align: "end" })}

                    ${Block("br", new Array(10).fill(""), { align: "end" })}
                </div>
            `;
        }
    }
}

export default connect(HUD);
