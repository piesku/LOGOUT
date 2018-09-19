import { Game, integer, element_of} from "./cervus/core";
import {Transform, Move} from "./cervus/components";
import GridMove from "./grid-move";
import EnergySaver from "./energysaver";
import Actor from "./actor";
import {
    SCALE,
    CLEAR_COLOR,
    WIREFRAME_COLOR,
    NEON_SCALE} from "./config";
import {
    create_exit,
    create_floor,
    create_building,
    create_powerup} from "./creators";

import * as sys from "./systems";
import map from "./new-map.json";

export function create_game() {
    let game = new Game({
      width: window.innerWidth,
      height: window.innerHeight,
      far: 126,
      clear_color: CLEAR_COLOR,
    });

    game.buildings = [];

    game.perspe_matrix = JSON.parse(JSON.stringify(game.projMatrix));
    game.setup_ortho_camera();

    game.canvas.addEventListener(
        "click", () => document.body.requestPointerLock());

    game.camera.get(Transform).set({
        position: [
            map.start[0] * SCALE,
            1.75,
            map.start[1] * SCALE],
    });

    game.camera.detach(Move);

    let grid_move = new GridMove();
    game.camera.attach(grid_move);

    grid_move.set({
        keyboard_controlled: true,
        mouse_controlled: false,
        move_speed: 7,
        rotate_speed: 0,
    });

    game.camera.attach(new Actor());
    game.camera.attach(new EnergySaver());

    // Remove the default light.
    game.remove(game.light);

    let floor = create_floor({
        position: [0, -0.5, 0],
        scale: [map.size[0] * SCALE * 10, 1, map.size[1] * SCALE * 10],
    });
    game.add(floor);

    for (let [x1, y1, x2, y2, h] of map.buildings) {
        let xsize = Math.abs(x2 - x1) * SCALE;
        let zsize = Math.abs(y2 - y1) * SCALE;

        let center_x = x1 * SCALE + (xsize/2);
        let center_z = y1 * SCALE + (zsize/2);

        let height = h * SCALE;

        let building = create_building({
            position: [center_x, height / 2, center_z],
            scale: [xsize, height, zsize],
            neons: new Array(integer(2, 4)).fill(0).map((_, index, arr) => {
                let is_north_south = element_of([true, false]);
                let is_negative = element_of([1, -1]);
                let neon_height = (height * NEON_SCALE) / (arr.length + 0.5);
                return {
                    position: [
                      is_north_south ? 0 : (is_negative * (xsize / 2) + (is_negative * 0.2)),
                      height / 2 - ((neon_height + 0.5) * (index + 1)),
                      is_north_south ? (is_negative * (zsize / 2) + (is_negative * 0.2)) : 0],
                    scale: [
                      is_north_south ? xsize * NEON_SCALE : 0.1,
                      neon_height,
                      is_north_south ? 0.1 : zsize * NEON_SCALE
                    ],
                    color: WIREFRAME_COLOR,
                    is_north_south,
                    is_negative
                }
            }),
        });
        game.add(building);
        game.buildings.push([center_x - xsize / 2, center_x + xsize / 2, center_z - zsize / 2, center_z + zsize/2]);
    }

    for (let [name, x, z] of map.items) {
        game.add(create_powerup({
            system: sys[name],
            position: [x * SCALE, 1.75, z * SCALE]}));
    }

    window.game = game;
    return game;
}

export function reveal_exit(game) {
    let height = 50 * SCALE;
    game.add(create_exit({
        position: [
            map.end[0] * SCALE,
            height / 2,
            map.end[1] * SCALE],
        scale: [5 * SCALE, 200, 5 * SCALE],
    }));
}

export function destroy_game(game) {
    game.stop();
    game.destroy();
    game.canvas.remove();
}
