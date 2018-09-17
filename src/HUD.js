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
import {ACTIVATE} from "./actions";
import { MatrixTween } from './cervus/tweens';

function HUD({game, last_active, systems}) {
    return new class extends Component {
        after(root) {
            if (!systems[sys.PERSPECTIVE]) {
                setTimeout(() =>
                    (new MatrixTween({
                        object: game.projMatrix,
                        to: game.perspe_matrix,
                        time: 3000,
                        game: game
                    })).start(),
                    5000);

                setTimeout(() =>
                    dispatch(ACTIVATE, sys.PERSPECTIVE),
                    7000);
            }
        }

        render() {
            return html`
                <div class="m u">
                    ${systems[sys.HUD] && Status("tl", {}, systems)}

                    ${systems[sys.COMPASS] && Compass("tm", {
                        justify: "center"
                    })}

                    ${systems[sys.CLOCK] && Time("tr", {
                        justify: "end"
                    })}

                    ${Block("mm", [
                        last_active,
                        "<div class='h e'>Activated</div>",
                    ], { align: "center", justify: "center", cls: "f" })}

                    ${systems[sys.HUD] && Block("mr", [
                        "Active objectives",
                        "> 01. Bring Systems Online",
                        "> 02. Locate exit",
                        "> 03. Init logout sequence",
                    ])}

                    ${systems[sys.PERSPECTIVE] && Matrix("bl", {
                        align: "end"
                    })}

                    ${systems[sys.SOLID] && Code("br", {
                        align: "end"
                    })}
                </div>
            `;
        }
    }
}

export default connect(HUD);
