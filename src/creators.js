import {Entity} from "./cervus/core";
import {Transform, Render, Light} from "./cervus/components";
import {Box} from "./cervus/shapes";
import Rotator from "./rotator";
import Trigger from "./trigger";
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
    NEON_LIGHT_MOUNT_DISTANCE} from "./config";
import {
    ACTIVATE,
    EXIT} from "./actions";

let cube_render = (new Box()).get_component(Render);

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
            //     material: wireframe_material,
            //     indices: cube_render.indices,
            //     vertices: cube_render.vertices
            // })
        ]
    });
}

export function create_neon({position, scale, color, is_north_south, is_negative}) {
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
        position: [
            is_north_south ? 0 : is_negative * NEON_LIGHT_MOUNT_DISTANCE,
            0,
            is_north_south ? is_negative * NEON_LIGHT_MOUNT_DISTANCE : 0
        ],
        color,
        intensity: NEON_INTENSITY,
    });
    neon.add(neon_light);
    return neon;
}

export function create_building({position, scale, neons}) {
    let group = new Entity({
        components: [
            new Transform({position})
        ]
    });

    let building = new Box();
    building.get_component(Render).set({
        material: wireframe_material,
        color: WIREFRAME_COLOR,
        tag: BUILDING_TAG,
    });
    building.get_component(Transform).set({scale});
    group.add(building);

    for (let neon_opts of neons) {
        let neon = create_neon(neon_opts);
        group.add(neon);
    }

    return group;
}

export function create_exit(options) {
    let exit = new Box();
    exit.get_component(Render).set({
        material: neon_material,
        color: POWERUP_COLOR,
    });
    exit.get_component(Transform).set(options);
    exit.add_component(new Trigger({
        radius: 0.6,
        action: [EXIT]
    }));
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
    cube.add_component(new Trigger({
        radius: 1,
        action: [ACTIVATE, system]
    }));
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
