import { Component } from "./innerself";
import { connect, html } from "./store";
import Block from "./Block";
import Line from "./Line";
import code_anim from "./anim_code";
import "./anim_glitch";
import game from "./game";
import { angle } from 'gl-matrix/src/gl-matrix/vec3';

let compass = "NW ---- N ---- NE ---- E ---- SE ---- S ---- SW ---- W ---- ";
let compass_length = compass.length;
compass = compass + compass + compass;
let step = (Math.PI * 2) / compass_length;
let visible_characters = 18;

function HUD({ lastActive, systems }) {
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
                let tr = root.querySelector(".tr .glitch");
                for (let child of tr.children) {
                    child.textContent = (new Date()).toString();
                }
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
                let children = [...bl.children].slice(1);
                for (let [i, line] of children.entries()) {
                    for (let child of line.querySelector(".glitch").children) {
                        child.textContent = values[i].map(
                            n => this.nf.format(n)
                        ).join(" ");
                    }

                    i++;
                }

                let tm = root.querySelector(".tm");
                let forward = game.camera.get_component(Cervus.components.Transform).forward;
                let sign = forward[0] > 0 ? -1 : 1;
                let start = Math.round(angle([0, 0, 1], forward) / step) * sign;
                let section = (compass + compass + compass).slice(compass_length + start, compass_length + start + visible_characters);
                tm.textContent = section;
            });
        }

        render() {
            let systems_status = [];
            for (let [sys, stat] of Object.entries(systems)) {
                systems_status.push(`${sys} = ${stat}`);
            }
            return html`
                <div class="screen layout">
                    ${Block("tl", [
                    "System status",
                    ...systems_status
                ])}
                    ${Block("tm", [
                    "N ----- NE ----- E",
                ], { justify: "center" })}
                    ${Block("tr", [
                    (new Date()).toString()
                ], { justify: "end" })}
                    ${Block("ml", [
                    "Active objectives",
                    "> 01. Enhance capabilities",
                    "> 02. Locate exit",
                    "> 03. Init logout sequence",
                ])}
                    ${Block("mm", [
                    lastActive,
                    "<div class='box big'>Activated</div>",
                ], { align: "center", justify: "center", cls: "flicker" })}
                    ${Block("mr", [
                    "Running analysis",
                    "Assessment complete",
                    "<div class=box>No threats found</div>",
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
