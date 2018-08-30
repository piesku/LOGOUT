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

/* global Cervus */

const CLEAR_COLOR = "333";
const BUILDING_COLOR = "000";
const NEON_COLORS = ["28D7FE", "A9FFDC", "FED128"];

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

game.canvas.addEventListener(
  'click', () => game.canvas.requestPointerLock()
);

game.camera.get_component(Cervus.components.Transform).position = [0, 20, 0];
game.camera.get_component(Cervus.components.Move).keyboard_controlled = true;
//game.camera.get_component(Cervus.components.Move).mouse_controlled = true;
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
  distance: new Float32Array([100, 500]),
});

let building_material = new Cervus.materials.PhongMaterial({
  requires: [
    Cervus.components.Render,
    Cervus.components.Transform
  ]
});

building_material.add_fog({
  color: hex_to_rgb(CLEAR_COLOR),
  distance: new Float32Array([5, 300]),
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
    scale: [50, 500, 40],
    neon_position: [0, 240, -22],
    neon_scale: [25, 10, 1],
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
    position: [-30, 0, 120],
    scale: [35, 300, 40],
    neon_position: [0, 140, -22],
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
