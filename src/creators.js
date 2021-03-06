import {Entity} from "./cervus/core";
import {Transform, Render, Light} from "./cervus/components";
import {Box} from "./cervus/shapes";
import NearbyLight from "./nearbylight";
import Rotator from "./rotator";
import Trigger from "./trigger";
import {
    BUILDING_TAG,
    NEON_TAG,
    POWERUP_TAG,
    powerup_material,
    wireframe_material} from "./materials";
import {
    WIREFRAME_COLOR,
    POWERUP_COLOR,
    POWERUP_INTENSITY,
    NEON_INTENSITY,
    NEON_LIGHT_MOUNT} from "./config";
import {
    ACTIVATE,
    EXIT} from "./actions";

function create_group(position) {
    return new Entity({
        components: [
            new Transform({position})
        ]
    });
}

export function create_floor({position, scale}) {
    let plane = new Box();
    plane.get(Render).set({
        material: wireframe_material,
        color: WIREFRAME_COLOR,
        tag: BUILDING_TAG,
    });
    plane.get(Transform).set({
        position,
        scale
    });
    return plane;
}

function create_light({position, color, intensity}) {
    return new Entity({
        components: [
            new Transform({position}),
            new NearbyLight({color, intensity}),
        ]
    });
}

export function create_neon({position, scale, color, is_north_south, is_negative}) {
    let group = create_group(position);

    let neon = new Box();
    neon.get(Render).set({
        material: wireframe_material,
        color,
        tag: NEON_TAG,
    });
    neon.get(Transform).set({
        scale
    });
    group.add(neon);

    let neon_light = create_light({
        position: [
            is_north_south ? 0 : is_negative * NEON_LIGHT_MOUNT,
            0,
            is_north_south ? is_negative * NEON_LIGHT_MOUNT : 0
        ],
        color,
        intensity: NEON_INTENSITY,
    });
    group.add(neon_light);
    return group;
}

export function create_building({position, scale, neons}) {
    let group = create_group(position);

    let building = new Box();
    building.get(Render).set({
        material: wireframe_material,
        color: WIREFRAME_COLOR,
        tag: BUILDING_TAG,
    });
    building.get(Transform).set({scale});
    group.add(building);

    for (let neon_opts of neons) {
        let neon = create_neon(neon_opts);
        group.add(neon);
    }

    return group;
}

export function create_exit(options) {
    let exit = new Box();
    exit.get(Render).set({
        material: powerup_material,
        color: POWERUP_COLOR,
    });
    exit.get(Transform).set(options);
    exit.attach(new Trigger({
        radius: 0.6,
        action: [EXIT]
    }));
    exit.attach(new Rotator({
        speed: [0, 0.0001, 0],
    }));
    return exit;
}

export function create_powerup({system, position}) {
    let cube = new Box();
    cube.get(Render).set({
        material: wireframe_material,
        color: POWERUP_COLOR,
        tag: POWERUP_TAG,
    });
    cube.get(Transform).set({position});
    cube.attach(new Trigger({
        radius: 1,
        action: [ACTIVATE, system]
    }));
    cube.attach(new Rotator({
        speed: [0.0001, 0.0002, 0.0003],
    }));

    let light = new Entity({
        components: [
            new Transform(),
            new Light({
                color: POWERUP_COLOR,
                intensity: POWERUP_INTENSITY,
            }),
        ]
    });
    cube.add(light);
    return cube;
}
