import {BasicMaterial, PhongMaterial, WireframeMaterial} from "./cervus/materials";
import {hex_to_rgb} from "./cervus/utils";
import {CLEAR_COLOR} from "./config";

export const BUILDING_TAG = 1;
export const NEON_TAG = 2;
export const POWERUP_TAG = 3;

export let neon_material = new BasicMaterial();
neon_material.add_fog({
    color: hex_to_rgb(CLEAR_COLOR),
    distance: new Float32Array([25, 100]),
});

export let powerup_material = new BasicMaterial();

export let building_material = new PhongMaterial();
building_material.add_fog({
    color: hex_to_rgb(CLEAR_COLOR),
    distance: new Float32Array([0, 40]),
});

export let wireframe_material = new WireframeMaterial();
