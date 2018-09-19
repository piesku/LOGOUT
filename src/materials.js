import {BasicMaterial, PhongMaterial, WireframeMaterial} from "./cervus/materials";
import {hex_to_rgb} from "./cervus/utils";
import {
    CLEAR_COLOR,
    BUILDING_FOG_MIN,
    BUILDING_FOG_MAX,
    NEON_FOG_MIN,
    NEON_FOG_MAX} from "./config";

export let BUILDING_TAG = 1;
export let NEON_TAG = 2;
export let POWERUP_TAG = 3;

export let neon_material = new BasicMaterial();
neon_material.add_fog({
    color: hex_to_rgb(CLEAR_COLOR),
    distance: new Float32Array([NEON_FOG_MIN, NEON_FOG_MAX]),
});

export let powerup_material = new BasicMaterial();

export let building_material = new PhongMaterial();
building_material.add_fog({
    color: hex_to_rgb(CLEAR_COLOR),
    distance: new Float32Array([BUILDING_FOG_MIN, BUILDING_FOG_MAX]),
});

export let wireframe_material = new WireframeMaterial();
