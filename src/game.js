import {Game, integer as random_integer} from "./cervus/core";
import {Transform, Move} from "./cervus/components";
import Actor from "./actor";
import {
    CLEAR_COLOR,
    MIN_BUILDING_HEIGHT,
    MAX_BUILDING_HEIGHT,
    WIREFRAME_COLOR} from "./config";
import {
    create_exit,
    create_floor,
    create_building,
    create_powerup} from "./creators";

import * as sys from "./systems";
import map from "./new-map.json";

export function create_game() {
    const game = new Game({
      width: window.innerWidth,
      height: window.innerHeight,
      // projection: "ortho",
      far: 1000,
      clear_color: CLEAR_COLOR,
    });

    game.perspe_matrix = JSON.parse(JSON.stringify(game.projMatrix));
    game.setup_ortho_camera();

    game.canvas.addEventListener(
        "click", () => document.body.requestPointerLock());

    game.camera.get_component(Transform).set({
        position: [map.starting_point.x, 1.75, map.starting_point.y],
    });

    game.camera.get_component(Move).set({
        keyboard_controlled: true,
        mouse_controlled: false,
        move_speed: 5,
        rotate_speed: 0,
    });

    game.camera.add_component(new Actor());

    // Remove the default light.
    game.remove(game.light);

    let floor = create_floor({
        position: [0, -0.5, 0],
        scale: [map.size.x * 10, 1, map.size.y * 10],
    });
    game.add(floor);

    for (let {x1, y1, x2, y2} of map.buildings) {
        let xsize = Math.abs(x2 - x1);
        let zsize = Math.abs(y2 - y1);

        let center_x = x1 + (xsize/2);
        let center_z = y1 + (zsize/2);

        let height = random_integer(
          MIN_BUILDING_HEIGHT, MAX_BUILDING_HEIGHT
        );

        let building = create_building({
            position: [center_x, height / 2, center_z],
            scale: [xsize, height, zsize],
            neons: [
                {
                    position: [0, 1, - (zsize/2) - 0.2],
                    scale: [4, 2, 0.1],
                    color: WIREFRAME_COLOR,
                }
            ],
        });
        game.add(building);
    }

    // POWER UPS

    game.add(create_powerup({
        system: sys.MOUSELOOK,
        position: [63, 1.75, 70]}));
    game.add(create_powerup({
        system: sys.COLOR,
        position: [63, 1.75, 80]}));
    game.add(create_powerup({
        system: sys.SOLID,
        position: [63, 1.75, 90]}));

    game.add(create_powerup({
        system: sys.CLOCK,
        position: [63, 1.75, 100]}));
    game.add(create_powerup({
        system: sys.COMPASS,
        position: [63, 1.75, 110]}));

    window.game = game;
    return game;
}

export function reveal_exit(game) {
    game.add(create_exit({
        position: [
            map.starting_point.x,
            63,
            map.starting_point.y],
        scale: [12, 126, 12],
    }));
}

export function destroy_game(game) {
    game.stop();
    game.destroy();
    game.canvas.remove();
}
