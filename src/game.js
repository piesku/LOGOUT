/* global Cervus */

const CLEAR_COLOR = "333";
const BUILDING_COLOR = "000";
const NEON_COLORS = ["28D7FE", "A9FFDC", "FED128"];

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
  far: 200,
  clear_color: CLEAR_COLOR,
});

game.canvas.addEventListener(
  'click', () => game.canvas.requestPointerLock()
);

game.camera.get_component(Cervus.components.Transform).position = [0, 20, 0];
game.camera.get_component(Cervus.components.Move).keyboard_controlled = true;
game.camera.get_component(Cervus.components.Move).mouse_controlled = true;
game.camera.get_component(Cervus.components.Move).move_speed = 35;

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
  distance: new Float32Array([100, 200]),
});

let building_material = new Cervus.materials.PhongMaterial({
  requires: [
    Cervus.components.Render,
    Cervus.components.Transform
  ]
});

building_material.add_fog({
  color: hex_to_rgb(CLEAR_COLOR),
  distance: new Float32Array([5, 150]),
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
plane.get_component(Cervus.components.Transform).scale = [1000, 1, 1000];
game.add(plane);

create_building({
    position: [20, 0, 100],
    scale: [30, 140, 15],
    neon_position: [0, 60, -10],
    neon_scale: [20, 10, 1],
    neon_color: NEON_COLORS[0],
});

create_building({
    position: [-30, 0, 50],
    scale: [45, 40, 15],
    neon_position: [15, 15, -10],
    neon_scale: [10, 5, 1],
    neon_color: NEON_COLORS[1],
});

create_building({
    position: [-30, 0, 100],
    scale: [20, 100, 40],
    neon_position: [0, 40, -21],
    neon_scale: [20, 10, 1],
    neon_color: NEON_COLORS[2],
});

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
                position: [0, 0, -2]
            }),
            new Cervus.components.Light({
                color: neon_color,
                intensity: 0.6,
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
