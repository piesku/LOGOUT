import { Game, Entity, image_loader } from 'cervus/core';
import { Box, Plane } from 'cervus/shapes';
import { PhongMaterial, BasicMaterial, WireframeMaterial } from 'cervus/materials';
import { Render, Transform, Move, Light } from 'cervus/components';
import { integer, float, element_of } from 'cervus/core/random';
import { MatrixTween } from 'cervus/tweens';
import { hex_to_rgb } from 'cervus/utils';
import map from './map.json';
const max_building_height = 16;
const min_building_height = 8;
const neon_thickness = 0.1;
const neon_margin = 0.5;
const neon_margin_from_bottom = 0.2;
const min_neon_height = 1;

export const game = new Game({
    width: window.innerWidth,
    height: window.innerHeight,
    clear_color: '000',
    // far: 12
    // fps: 1
});

const neon_colors = ['#fe0000', '#fdfe02', '#0bff01', '#011efe', '#fe00f6' ];
//["#28D7FE", "#A9FFDC", "#FED128"];//
const camera_transform = game.camera.get_component(Transform);
camera_transform.position = [map.starting_point.x, 0.42, map.starting_point.y]
camera_transform.rotation = [-0.067, 0.00169, 0.0001139, 0.9977];
window.camera = camera_transform;

// game.setup_perspective_camera();
// const persp_matrix = JSON.parse(JSON.stringify(game.projMatrix));
// game.setup_ortho_camera();
// const ortho_matrix = JSON.parse(JSON.stringify(game.projMatrix));

window.go_perspe = function () {
    const camera_tween = new MatrixTween({
        object: game.projMatrix,
        to: persp_matrix,
        time: 2000,
        game: game
    });

    let time = new Date();
    camera_tween.start().then(() => {
        console.log('color done!', new Date() - time)
        // console.log(target_matrix);
        // console.log(game.projMatrix);
    });
}


window.go_ortho = function () {
    const camera_tween = new MatrixTween({
        object: game.projMatrix,
        to: ortho_matrix,
        time: 2000,
        game: game
    });

    let time = new Date();
    camera_tween.start().then(() => {
        console.log('color done!', new Date() - time)
        // console.log(target_matrix);
        // console.log(game.projMatrix);
    });
}

game.camera.get_component(Move).keyboard_controlled = true;
// game.camera.get_component(Move).mouse_controlled = true;
game.light.get_component(Light).intensity = 0.1;
game.light.get_component(Light).color = 'fff';
game.light.get_component(Transform).position = [-400, -10, -20];
const material = new PhongMaterial({
// const material = new BasicMaterial({
    requires: [Render, Transform],
    // normal_map: image_loader('nmap.jpg')
});

const wireframe = new WireframeMaterial({
// const material = new BasicMaterial({
    requires: [Render, Transform]
});
material.add_fog({
    color: hex_to_rgb('000'),
    distance: new Float32Array([1, 12])
});
material.setup_program();

const neon_material = new PhongMaterial({
// const neon_material = new BasicMaterial({
    requires: [Render, Transform]
});
neon_material.add_fog({
    color: hex_to_rgb('000'),
    distance: new Float32Array([1, 40])
});
neon_material.setup_program();

const plane = new Plane();
const plane_transform = plane.get_component(Transform);
const plane_render = plane.get_component(Render);
plane_transform.scale = [map.size.x, 1, map.size.y];
plane_transform.position = [0, 0, 0];
plane_render.material = material;
plane_render.color = "F0F";
game.add(plane);

map.buildings.forEach(add_building);

function add_building(position) {
    const { x1, y1, x2, y2 } = position;
    const width = Math.abs(x2 - x1);
    const height = Math.abs(y2 - y1);
    // console.log({ width, height });

    const center_x = x1 + (width / 2);
    const center_y = y1 + (height / 2);

    const box = new Box();
    const building_height = integer(min_building_height, max_building_height);
    box.get_component(Transform).position = [center_x, building_height / 2, center_y];
    box.get_component(Transform).scale = [width, building_height, height];
    box.get_component(Render).material = material;
    box.get_component(Render).color = '000';
    game.add(box);

    const neon_rows = integer(1, 3);
    const neon_max_height = (building_height - neon_margin_from_bottom - neon_margin) / neon_rows;

    const neon_width = width - (neon_margin * 2);
    if (neon_max_height < min_neon_height) {
        return;
    }

    let neon_height = float(min_neon_height, neon_max_height);
    let neon_z = building_height - neon_margin - neon_height / 2;

    for (let i = 0; i < neon_rows; i++) {
        create_neon(neon_height, neon_width, center_x, neon_z, center_y - height / 2);
        neon_z -= (neon_height/2);// - neon_margin;
        neon_height = float(min_neon_height, neon_max_height);
        neon_z -= (neon_height / 2);
    }
}

function create_neon(max_height, width, x, z, y) {
    const box = new Box();
    const height = float(0.1, max_height);

    box.get_component(Transform).position = [x, z, y];
    box.get_component(Transform).scale = [width, height, neon_thickness];
    box.get_component(Render).material = neon_material;
    const color = element_of(neon_colors);
    box.get_component(Render).color = color;
    const light_2 = new Entity({
        components: [
            new Transform(),
            new Light({
                color,
                intensity: 0.9
            }),
            new Render({
                color: '#fff',
                material: wireframe,
                indices: box.get_component(Render).indices,
                vertices: box.get_component(Render).vertices
            })
        ]
    });
    game.add(light_2);

    light_2.get_component(Transform).position = [x, z, y - 0.3];
    light_2.get_component(Transform).scale = [0.2, 0.2, 0.2];
    game.add(light_2);
    game.add(box);
}


let dir = 3;
let step = 0.05;
let change = 0;
let max_change = 3;
// game.on('tick', () => {
//     change += (step * dir);

//     if (dir > 0 && change > max_change) {
//         console.log('yo');
//         change = max_change - step - step;
//         dir = -1;
//         return;
//     } else if (dir < 0 && change < -max_change) {
//         console.log('elo');
//         change = -max_change + step + step;
//         dir = 1;
//         return;
//     }

//     Array.from(game.get_entities_by_component(Light)).forEach((el) => {
//         const pos = el.get_component(Transform).position;
//         el.get_component(Transform).position = [
//             pos[0] + (step * dir),
//             ...pos.slice(1)
//         ];
//     });
//     // game.light.get_component(Transform).position = game.camera.get_component(Transform).position;
// });
