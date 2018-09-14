import {Component} from "./innerself";
import Block from "./Block";
import {set_glitch} from "./Glitch";
import {Transform} from './cervus/components';

export default function Matrix(cls, styles) {
    return new class extends Component {
        constructor() {
            super();
            this.nf = new Intl.NumberFormat("en", {
                minimumFractionDigits: 3,
                maximumFractionDigits: 3
            });
        }

        before(root) {
            game.off("afterrender", this.update_from_game);
        }

        after(root) {
            let rows = Array.from(
                root.querySelectorAll(`.${cls} .line`)
            ).slice(1);
            this.update_from_game = () => {
                // Update local matrix display
                let matrix = game.camera.get_component(Transform).matrix;
                let values = [
                    [matrix[0], matrix[4], matrix[8], matrix[12]],
                    [matrix[1], matrix[5], matrix[9], matrix[13]],
                    [matrix[2], matrix[6], matrix[10], matrix[14]],
                    [matrix[3], matrix[7], matrix[11], matrix[15]]
                ];

                // Skip the header.
                for (let [i, line] of rows.entries()) {
                    set_glitch(
                        line,
                        values[i].map(n => this.nf.format(n)).join(" "));
                }
            };

            game.on("afterrender", this.update_from_game);
        }

        render() {
            return Block(cls, [
                "Avatar entity matrix", "1", "2", "3", "4"
            ], styles);
        }
    }
}
