import {Component} from "./innerself";
import Block from "./Block";
import {set_glitch} from "./Glitch";
import {Transform} from './cervus/components';

export default function Matrix(cls, styles) {
    return new class extends Component {
        before() {
            game.off("afterrender", this.up);
        }

        after(root) {
            // Skip the header.
            let rows = Array.from(
                root.querySelectorAll(`.${cls} .l`)).slice(1);
            this.up = game.on("afterrender", () => {
                // Update local matrix display
                let matrix = game.camera.get(Transform).matrix.toFloat32Array();
                for (let [i, line] of rows.entries()) {
                    set_glitch(
                        line,
                        Array.from(matrix.slice(4 * i, 4 * i + 4), n => n.toFixed(3)).join(" "));
                }
            });
        }

        render() {
            return Block(cls, [
                "Entity matrix", "1", "2", "3", "4"
            ], styles);
        }
    }
}
