import { Game } from 'cervus/core';
import { Box, Plane } from 'cervus/shapes';
import { PhongMaterial } from 'cervus/materials';
import { Render, Transform, Move, Light } from 'cervus/components';
import { integer } from 'cervus/core/random';

import map from './map.json';
const max_building_height = 20;
const min_building_height = 12;

export const game = new Game({
    width: window.innerWidth,
    height: window.innerHeight,
    clear_color: '#000'
    // fps: 1
});


const camera_transform = game.camera.get_component(Transform);
camera_transform.position = [map.starting_point.x, 0.42, map.starting_point.y]
camera_transform.rotation = [-0.067, 0.00169, 0.0001139, 0.9977];
window.camera = camera_transform;
game.camera.get_component(Move).keyboard_controlled = true;
// game.camera.get_component(Move).mouse_controlled = true;
game.light.get_component(Light).intensity = 0.3;
game.light.get_component(Transform).position = [-400, -10, -20];
const material = new PhongMaterial({
    requires: [Render, Transform]
});



const plane = new Plane();
const plane_transform = plane.get_component(Transform);
const plane_render = plane.get_component(Render);
plane_transform.scale = [map.size.x, 1, map.size.y];
plane_transform.position = [0.5, -0.5, 0.5];
plane_render.material = material;
plane_render.color = "CCC";
game.add(plane);

map.buildings.forEach((building) => {
    const { x1, y1, x2, y2 } = building;
    const width = Math.abs(x2-x1);
    const height = Math.abs(y2-y1);
    console.log({width, height});

    const center_x = x1 + (width/2);
    const center_y = y1 + (height/2);

    const box = new Box();
    box.get_component(Transform).position = [center_x, 0, center_y];
    box.get_component(Transform).scale = [width, integer(min_building_height, max_building_height), height];
    box.get_component(Render).material = material;
    box.get_component(Render).color = '000';
    game.add(box);
});
