import {Entity} from "./cervus/core";
import {Transform, Render, Light} from "./cervus/components";
import {Box} from "./cervus/shapes";
import Rotator from "./rotator";
import {building_material, neon_material} from "./materials";
import * as CONFIG from "./config";

let cube_render = (new Box()).get_component(Render);

function create_group() {
    return new Entity({
        components: [
            new Transform({position})
        ]
    });
}

export function create_floor({position, scale}) {
    let plane = new Box();
    plane.get_component(Render).set({
        material: building_material,
        config: CONFIG.BUILDING_COLOR
    });
    plane.get_component(Transform).set({
        position,
        scale
    });
    return plane;
}

export function create_neon({position, scale, color}) {
    let neon = new Box();
    neon.get_component(Render).set({
        material: neon_material,
        color
    });
    neon.get_component(Transform).set({
        position,
        scale
    });

    let neon_light = new Entity({
        components: [
            new Transform({
                position: CONFIG.NEON_LIGHT_MOUNT
            }),
            new Light({
                color,
                intensity: CONFIG.NEON_INTENSITY,
            }),
            // new Render({
            //     color: "fff",
            //     material: wireframe,
            //     indices: cube_render.indices,
            //     vertices: cube_render.vertices
            //})
        ]
    });
    neon.add(neon_light);
    return neon;
}

export function create_building(options) {
    let {
        position,
        scale,
        material = building_material,
        color = CONFIG.BUILDING_COLOR,
        neons = [],
    } = options;

    let group = new Entity({
        components: [
            new Transform({position})
        ]
    });

    let building = new Box();
    building.get_component(Render).set({
        material,
        color
    });
    building.get_component(Transform).set({scale});
    group.add(building);

    for (let neon_opts of neons) {
        let neon = create_neon(neon_opts);
        group.add(neon);
    }

    return group;
}

export function create_exit({position}) {
    let exit = create_building({
        position,
        scale: [5, 10, 5],
        material: neon_material,
        color: "fff",
    });
    exit.add_component(new Rotator({
        speed: [0, 0.0001, 0],
    }));
    return exit;
}

export function create_powerup({position}) {
    let cube = new Box();
    cube.get_component(Render).set({
        material: neon_material,
        color: CONFIG.POWERUP_COLOR,
    });
    cube.get_component(Transform).set({position});
    cube.add_component(new Rotator({
        speed: [0.0001, 0.0002, 0.0003],
    }));

    let light = new Entity({
        components: [
            new Transform(),
            new Light({
                color: CONFIG.POWERUP_COLOR,
                intensity: CONFIG.POWERUP_INTENSITY,
            }),
        ]
    });
    cube.add(light);
    return cube;
}
