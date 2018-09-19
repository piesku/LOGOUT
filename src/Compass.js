import {Component} from "./innerself";
import {Transform} from "./cervus/components";
import {vec3, to_radian} from "./cervus/math";
import {connect} from "./store";
import Block from "./Block";
import {set_glitch} from "./Glitch";
import Trigger from "./trigger";
import {clamp, map} from "./util";

let compass = "NW ---- N ---- NE ---- E ---- SE ---- S ---- SW ---- W ---- ";
let compass_length = compass.length;
compass = compass + compass + compass;
let step = (Math.PI * 2) / compass_length;
let visible_characters = 18;

function Compass({game}, cls, styles) {
    let half_fov = to_radian(game.fov / 2);
    return new class extends Component {
        before() {
            game.off("afterrender", this.up);
        }

        after(root) {
            let nswe = root.querySelector(`.${cls} > :first-child`);
            let radar = root.querySelector(`.${cls} > :last-child`);
            this.up = game.on("afterrender", () => {
                let transform = game.camera.components.get(Transform);
                let forward = transform.forward;
                let sign = forward[0] > 0 ? -1 : 1;
                let start = Math.round(vec3.angle([0, 0, 1], forward) / step) * sign;
                let section = (compass + compass + compass).slice(compass_length + start, compass_length + start + visible_characters);
                set_glitch(nswe, section);

                let counts = new Array(visible_characters).fill(0);
                for (let trigger of game.components.get(Trigger)) {
                    let trigger_position = trigger.entity.components.get(Transform).position;
                    // Project the position to eye level.
                    trigger_position[1] = 1.75;
                    let direction = vec3.zero.slice();
                    vec3.subtract(direction, trigger_position, transform.position);
                    vec3.normalize(direction, direction);

                    // vec3.angle returns angles in [0, Math.PI], regardless of
                    // whether the trigger is on the left or on the right of the
                    // forward vector. Calculate the angle to the left vector,
                    // too, and use it to compute the sign.
                    let rad = vec3.angle(transform.forward, direction);
                    rad = clamp(rad, 0, half_fov);
                    rad *= Math.sign(vec3.angle(transform.left, direction) - Math.PI/2);

                    let cell = Math.round(map(rad, -half_fov, half_fov, 0, visible_characters - 1));
                    counts[cell]++;
                }

                set_glitch(radar, counts.map(n => n > 0 ? "^" : "&nbsp;").join(""))
            });
        }

        render() {
            return Block(
                cls,
                ["Compass", "Radar"],
                styles
            );
        }
    }
}

export default connect(Compass);
