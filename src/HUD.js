import { Component } from "./innerself";
import { connect, html } from "./store";
import Code from "./Code";
import Time from "./Time";
import Compass from "./Compass";
import Matrix from "./Matrix";
import Status from "./Status";
import Block from "./Block";
import Line from "./Line";
import Glitch, {set_glitch} from "./Glitch";
import code_anim from "./anim_code";
import * as sys from "./systems";

function HUD({game, last_active, systems}) {
    return new class extends Component {
        after(root) {
            if (!systems[sys.HUD]) {
                setTimeout(() => {
                    game.setup_perspective_camera();
                    dispatch("ACTIVATE", sys.HUD);
                }, 5000);
            }
        }

        render() {
            return html`
                <div class="screen hud">
                    ${systems[sys.HUD] && Status("tl", {}, systems)}

                    ${systems[sys.HUD] && Compass("tm", {
                        justify: "center"
                    })}

                    ${systems[sys.HUD] && Time("tr", {
                        justify: "end"
                    })}

                    ${Block("mm", [
                        last_active,
                        "<div class='box big'>Activated</div>",
                    ], { align: "center", justify: "center", cls: "flicker" })}

                    ${systems[sys.HUD] && Block("mr", [
                        "Active objectives",
                        "> 01. Enhance capabilities",
                        "> 02. Locate exit",
                        "> 03. Init logout sequence",
                    ])}

                    ${systems[sys.HUD] && Matrix("bl", {
                        align: "end"
                    })}

                    ${systems[sys.HUD] && Code("br", {
                        align: "end"
                    })}
                </div>
            `;
        }
    }
}

export default connect(HUD);
