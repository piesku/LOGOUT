import {BasicMaterial, PhongMaterial, WireframeMaterial} from "./cervus/materials";
import {Render, Transform} from "./cervus/components";
import {CLEAR_COLOR} from "./config";

function hex_to_rgb(hex) {
  if (hex.charAt(0) === '#') {
    hex = hex.substr(1);
  }

  if (hex.length === 3) {
    hex = hex.split('').map(
      el => el + el
    ).join('');
  }

  return hex.match(/.{1,2}/g).map(
    el => parseFloat((parseInt(el, 16) / 255).toFixed(2))
  );
}

export let neon_material = new BasicMaterial({
    requires: [
        Render,
        Transform
    ]
});

neon_material.add_fog({
    color: hex_to_rgb(CLEAR_COLOR),
    distance: new Float32Array([10, 100]),
});

export let building_material = new PhongMaterial({
    requires: [
        Render,
        Transform
    ]
});

building_material.add_fog({
    color: hex_to_rgb(CLEAR_COLOR),
    distance: new Float32Array([0, 30]),
});

export let wireframe = new WireframeMaterial({
    requires: [
        Render,
        Transform
    ]
});
