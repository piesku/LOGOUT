import {Game, integer as random_integer} from "./cervus/core";
import {Transform, Move} from "./cervus/components";
import {
    CLEAR_COLOR,
    MIN_BUILDING_HEIGHT,
    MAX_BUILDING_HEIGHT,
    WIREFRAME_COLOR} from "./config";
import {
    create_floor,
    create_building,
    create_exit,
    create_powerup} from "./creators";

import map from "./map.json";

export default
function create_game() {
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
      'click', () => game.canvas.requestPointerLock()
    );

    game.camera.get_component(Transform).set({
        position: [map.starting_point.x, 1.75, map.starting_point.y],
    });

    game.camera.get_component(Move).set({
        keyboard_controlled: true,
        mouse_controlled: true,
        move_speed: 5,
    });

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

    let exit = create_exit({
        position: [map.starting_point.x, 10, map.starting_point.y + 20],
    });
    // game.add(exit);

    let powerup = create_powerup({
        position: [map.starting_point.x - 2, 1.75, map.starting_point.y + 25],
    });
    game.add(powerup);

    window.game = game;
    return game;
}
