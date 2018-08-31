(function () {
'use strict';

const init = {
    lastActive: "Power Fallback",
    systems: {
        "Power Fallback": "Online",
        "Grid Movement": "Online",
        "Perspective": "Offline",
        "Enhanced DoF": "Offline",
        "Chromatic Vision": "Offline",
    },
};

function reducer(state = init, action, args) {
    switch (action) {
        case "ACTIVATE": {
            let [lastActive] = args;
            return Object.assign({}, state, {
                lastActive,
                systems: Object.assign({}, state.systems, {
                    [lastActive]: "Online"
                })
            });
        }
        default:
            return state;
    }
}

var store = createStore(reducer);

function Line(text) {
    // A deterministic digest function provides variety and ensures
    // subsequent renders given the same state produce the same output.
    let glitchIndex = text.length % 20;
    return html`
        <div class="line">
            <div class="glitch">
                <div class="glitch1 noise${glitchIndex}">${text}</div>
                <div class="glitch2 noise${glitchIndex}">${text}</div>
                <div class="glitch3 noise${glitchIndex}">${text}</div>
            </div>
        </div>
    `;
}

function Block(area, lines, {align = "stretch", justify = "stretch", cls = ""} = {}) {
    return html`
        <div class="block ${area} ${cls}"
            style="grid-area: ${area}; align-self: ${align}; justify-self: ${justify};">
            ${lines.map(Line)}
        </div>
    `;
}

// Generate animated code display
function *generateCode() {
    let lines = Cervus.shaders.fragment.toString()
        .split("\n").slice(7, -2)
        .map(line => line.trim())
        .filter(Boolean);
    let i = 0;
    while (1) {
        yield lines[i++ % lines.length];
    }
}

var code_anim = generateCode();

// Generate glitch animations
let sheet = document.styleSheets[0];
let steps = 20;
let percent = new Intl.NumberFormat("en", {style: "percent"});
for (let i = 0; i < 20; i++) {
    sheet.insertRule(`
        @keyframes noise${i} {
            ${new Array(steps).fill(1).map((_, step) => `
                ${percent.format(step / steps)} {
                    clip-path: inset(
                        ${percent.format(Math.random())} 0
                        ${percent.format(Math.random())}
                    );
                }
            `).join("")}
        }
    `);
    sheet.insertRule(`
        .glitch2.noise${i} {
            animation: noise${i} ${Math.random() * 5}s linear infinite alternate;
        }
    `);
    sheet.insertRule(`
        .glitch3.noise${i} {
            animation: noise${i} ${Math.random() * 5}s linear infinite alternate;
        }
    `);
}

var size = {
	x: 504,
	y: 504
};
var buildings = [
	{
		x1: 328,
		y1: 92,
		x2: 336,
		y2: 100
	},
	{
		x1: 340,
		y1: 92,
		x2: 348,
		y2: 108
	},
	{
		x1: 356,
		y1: 92,
		x2: 368,
		y2: 104
	},
	{
		x1: 324,
		y1: 104,
		x2: 332,
		y2: 120
	},
	{
		x1: 352,
		y1: 108,
		x2: 360,
		y2: 116
	},
	{
		x1: 336,
		y1: 112,
		x2: 344,
		y2: 120
	},
	{
		x1: 352,
		y1: 120,
		x2: 364,
		y2: 128
	},
	{
		x1: 320,
		y1: 124,
		x2: 336,
		y2: 132
	},
	{
		x1: 356,
		y1: 132,
		x2: 364,
		y2: 144
	},
	{
		x1: 320,
		y1: 136,
		x2: 332,
		y2: 144
	},
	{
		x1: 344,
		y1: 136,
		x2: 352,
		y2: 144
	}
];
var items = [
];
var starting_point = {
	x: 340,
	y: 72
};
var map = {
	size: size,
	buildings: buildings,
	items: items,
	starting_point: starting_point
};

/* global Cervus */

const CLEAR_COLOR = "333";
const BUILDING_COLOR = "222";
const NEON_COLORS = ["28D7FE", "A9FFDC", "FED128"];
const NEON_LIGHT_MOUNT = [0, 0, -20];
const NEON_INTENSITY = 15;

const MAX_BUILDING_HEIGHT = 32;
const MIN_BUILDING_HEIGHT = 8;

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

function HUD({lastActive, systems}) {
    let systems_status = [];
    for (let [sys, stat] of Object.entries(systems)) {
        systems_status.push(`${sys} = ${stat}`);
    }
    return html`
        <div class="screen layout">
            ${Block("tl", [
                "System status",
                ...systems_status
            ])}
            ${Block("tm", [
                "N ----- NE ----- E",
            ], {justify: "center"})}
            ${Block("tr", [
                (new Date()).toString()
            ], {justify: "end"})}
            ${Block("ml", [
                "Active objectives",
                "> 01. Enhance capabilities",
                "> 02. Locate exit",
                "> 03. Init logout sequence",
            ])}
            ${Block("mm", [
                lastActive,
                "<div class='box big'>Activated</div>",
            ], {align: "center", justify: "center", cls: "flicker"})}
            ${Block("mr", [
                "Running analysis",
                "Assessment complete",
                "<div class=box>No threats found</div>",
            ])}
            ${Block("bl", [
                // Use empty lines of differnt length to use different
                // glitch animations.
                "Avatar entity matrix", "", " ", "  ", "   "
            ], {align: "end"})}
            ${Block("br", new Array(10).fill(""), {align: "end"})}
        </div>
    `;
}

var HUD$1 = store.connect(HUD);

let root = document.querySelector("#root");

let interval;
root.addEventListener("beforerender", function() {
    clearInterval(interval);
});
root.addEventListener("afterrender", function() {
    interval = setInterval(() => {
        let div = document.createElement("div");

        // Animate code display
        let br = root.querySelector(".br");
        br.removeChild(br.firstElementChild);
        div.innerHTML = Line(code_anim.next().value);
        br.appendChild(div.firstElementChild);

        // Update datetime
        let tr = root.querySelector(".tr .glitch");
        for (let child of tr.children) {
            child.textContent = (new Date()).toString();
        }
    }, 1000);
});

let nf = new Intl.NumberFormat("en", {minimumFractionDigits: 3, maximumFractionDigits: 3});

game.on("afterrender", function() {
    // Update local matrix display
    let bl = root.querySelector(".bl");
    let matrix = game.camera.get_component(Cervus.components.Transform).matrix;
    let values = [
        [matrix[0], matrix[4], matrix[8], matrix[12]],
        [matrix[1], matrix[5], matrix[9], matrix[13]],
        [matrix[2], matrix[6], matrix[10], matrix[14]],
        [matrix[3], matrix[7], matrix[11], matrix[15]]
    ];

    // Skip the header.
    let children = [...bl.children].slice(1);
    for (let [i, line] of children.entries()) {
        for (let child of line.querySelector(".glitch").children) {
            child.textContent = values[i].map(n => nf.format(n)).join(" ");
        }

        i++;
    }
});

store.attach(HUD$1, document.querySelector("#root"));
window.dispatch = store.dispatch;

}());
