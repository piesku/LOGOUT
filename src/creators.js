import {Entity} from "./cervus/core";
import {Transform, Render, Light} from "./cervus/components";
import {Box} from "./cervus/shapes";
import Rotator from "./rotator";
import {
    BUILDING_TAG,
    NEON_TAG,
    INTERACTABLE_TAG,
    wireframe_material} from "./materials";
import {
    WIREFRAME_COLOR,
    POWERUP_COLOR,
    POWERUP_INTENSITY,
    NEON_INTENSITY,
    NEON_LIGHT_MOUNT} from "./config";

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
        material: wireframe_material,
        color: WIREFRAME_COLOR,
        tag: BUILDING_TAG,
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
        material: wireframe_material,
        color,
        tag: NEON_TAG,
    });
    neon.get_component(Transform).set({
        position,
        scale
    });

    let neon_light = new Entity({
        components: [
            new Transform({
                position: NEON_LIGHT_MOUNT
            }),
            new Light({
                color,
                intensity: NEON_INTENSITY,
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
        tag = BUILDING_TAG,
        material = wireframe_material,
        color = WIREFRAME_COLOR,
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
        color,
        tag,
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
        material: wireframe_material,
        color: "fff",
        tag: INTERACTABLE_TAG,
    });
    exit.add_component(new Rotator({
        speed: [0, 0.0001, 0],
    }));
    return exit;
}

export function create_powerup({position}) {
    let cube = new Box();
    cube.get_component(Render).set({
        material: wireframe_material,
        color: POWERUP_COLOR,
        tag: INTERACTABLE_TAG,
    });
    cube.get_component(Transform).set({position});
    cube.add_component(new Rotator({
        speed: [0.0001, 0.0002, 0.0003],
    }));

    let light = new Entity({
        components: [
            new Transform(),
            new Light({
                color: WIREFRAME_COLOR,
                intensity: POWERUP_INTENSITY,
            }),
        ]
    });
    cube.add(light);
    return cube;
}
