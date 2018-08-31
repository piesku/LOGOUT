/* global Cervus */

const CLEAR_COLOR = "333";
const BUILDING_COLOR = "222";
const NEON_COLORS = ["28D7FE", "A9FFDC", "FED128"];
const NEON_LIGHT_MOUNT = [0, 0, -20];
const NEON_INTENSITY = 15;

import map from './map.json';
const MAX_BUILDING_HEIGHT = 32;
const MIN_BUILDING_HEIGHT = 8;

class Group extends Cervus.core.Entity {
  constructor(options) {
    super(Object.assign({
      components: [
          new Cervus.components.Transform()
      ]
    }, options));
  }
}

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

const game = new Cervus.core.Game({
  width: window.innerWidth,
  height: window.innerHeight,
  far: 1000,
  clear_color: CLEAR_COLOR,
});

export {game as default};
window.game = game;

game.canvas.addEventListener(
  'click', () => game.canvas.requestPointerLock()
);

game.camera.get_component(Cervus.components.Transform).set({
    position: [map.starting_point.x, 1.75, map.starting_point.y],
});
game.camera.get_component(Cervus.components.Move).set({
    keyboard_controlled: true,
    mouse_controlled: true,
    move_speed: 5,
});

// Remove the default light.
game.remove(game.light);

const cube = new Cervus.shapes.Box();
const cube_render = cube.get_component(Cervus.components.Render);

let neon_material = new Cervus.materials.BasicMaterial({
  requires: [
    Cervus.components.Render,
    Cervus.components.Transform
  ]
});

neon_material.add_fog({
  color: hex_to_rgb(CLEAR_COLOR),
  distance: new Float32Array([10, 100]),
});

let building_material = new Cervus.materials.PhongMaterial({
  requires: [
    Cervus.components.Render,
    Cervus.components.Transform
  ]
});

building_material.add_fog({
  color: hex_to_rgb(CLEAR_COLOR),
  distance: new Float32Array([0, 30]),
});

const wireframe = new Cervus.materials.WireframeMaterial({
  requires: [
    Cervus.components.Render,
    Cervus.components.Transform
  ]
});

const plane = new Cervus.shapes.Box();
plane.get_component(Cervus.components.Render).material = building_material;
plane.get_component(Cervus.components.Render).color = BUILDING_COLOR;
plane.get_component(Cervus.components.Transform).set({
    position: [0, -0.5, 0],
    scale: [map.size.x * 10, 1, map.size.y * 10],
});
game.add(plane);

function create_building(options) {
    let {position, scale} = options;
    let group = new Cervus.core.Entity({
        components: [
            new Cervus.components.Transform({position})
        ]
    });

    let building = new Cervus.shapes.Box();
    building.get_component(Cervus.components.Render).set({
        material: building_material,
        color: BUILDING_COLOR,
    });
    building.get_component(Cervus.components.Transform).set({scale});
    group.add(building);

    let {neon_position, neon_scale, neon_color} = options;
    let neon = new Cervus.shapes.Box();
    neon.get_component(Cervus.components.Render).set({
        material: neon_material,
        color: neon_color,
    });
    neon.get_component(Cervus.components.Transform).set({
        position: neon_position,
        scale: neon_scale,
    });

    let neon_light = new Cervus.core.Entity({
        components: [
            new Cervus.components.Transform({
                position: NEON_LIGHT_MOUNT
            }),
            new Cervus.components.Light({
                color: neon_color,
                intensity: NEON_INTENSITY,
            }),
            // new Cervus.components.Render({
            //     color: "fff",
            //     material: wireframe,
            //     indices: cube_render.indices,
            //     vertices: cube_render.vertices
            //})
        ]
    });
    neon.add(neon_light);
    group.add(neon);

    game.add(group);
}

for (let building of map.buildings) {
    let {x1, y1, x2, y2} = building;
    let xsize = Math.abs(x2 - x1);
    let zsize = Math.abs(y2 - y1);

    let center_x = x1 + (xsize/2);
    let center_z = y1 + (zsize/2);

    let height = Cervus.core.integer(
        MIN_BUILDING_HEIGHT, MAX_BUILDING_HEIGHT);

    create_building({
        position: [center_x, height / 2, center_z],
        scale: [xsize, height, zsize],
        neon_position: [0, 1, - (zsize/2) - 0.2],
        neon_scale: [4, 2, 0.1],
        neon_color: Cervus.core.element_of(NEON_COLORS),
    });
}
