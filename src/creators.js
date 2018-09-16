import {Entity} from "./cervus/core";
import {Transform, Render, Light} from "./cervus/components";
import {Box} from "./cervus/shapes";
import PowerUp from "./powerup";
import Rotator from "./rotator";
import Bounds from "./bounds";
import {
    BUILDING_TAG,
    NEON_TAG,
    INTERACTABLE_TAG,
    neon_material,
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

function create_light({position, color, intensity}) {
    return new Entity({
        components: [
            new Transform({position}),
            new Light({color, intensity}),
            // new Render({
            //     color: "fff",
            //     material: wireframe,
            //     indices: cube_render.indices,
            //     vertices: cube_render.vertices
            //})
        ]
    });
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

    let neon_light = create_light({
        position: NEON_LIGHT_MOUNT,
        color,
        intensity: NEON_INTENSITY,
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
        scale: [5, 5, 5],
        material: neon_material,
        color: "fff",
        tag: null,
    });
    cube.add_component(new Exit({system}));
    cube.add_component(new Bounds());
    exit.add_component(new Rotator({
        speed: [0, 0.0001, 0],
    }));
    return exit;
}

export function create_powerup({system, position}) {
    let cube = new Box();
    cube.get_component(Render).set({
        material: wireframe_material,
        color: POWERUP_COLOR,
        tag: INTERACTABLE_TAG,
    });
    cube.get_component(Transform).set({position});
    cube.add_component(new PowerUp({system}));
    cube.add_component(new Bounds());
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
