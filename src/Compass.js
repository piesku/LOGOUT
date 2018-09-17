import {Component} from "./innerself";
import Block from "./Block";
import {set_glitch} from "./Glitch";
import {Transform} from './cervus/components';
import {angle} from 'gl-matrix/src/gl-matrix/vec3';

let compass = "NW ---- N ---- NE ---- E ---- SE ---- S ---- SW ---- W ---- ";
let compass_length = compass.length;
compass = compass + compass + compass;
let step = (Math.PI * 2) / compass_length;
let visible_characters = 18;

export default function Compass(cls, styles) {
    return new class extends Component {
        before(root) {
            game.off("afterrender", this.update_from_game);
        }

        after(root) {
            let container = root.querySelector(`.${cls}`);
            this.update_from_game = () => {
                let forward = game.camera.get_component(Transform).forward;
                let sign = forward[0] > 0 ? -1 : 1;
                let start = Math.round(angle([0, 0, 1], forward) / step) * sign;
                let section = (compass + compass + compass).slice(compass_length + start, compass_length + start + visible_characters);
                set_glitch(container, section);
            };

            game.on("afterrender", this.update_from_game);
        }

        render() {
            return Block(
                cls,
                ["----"],
                styles
            );
        }
    }
}
