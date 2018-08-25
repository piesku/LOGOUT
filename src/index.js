import { Game } from 'cervus/core';
import { Box, Plane } from 'cervus/shapes';
import { PhongMaterial } from 'cervus/materials';
import { Render, Transform, Move } from 'cervus/components';
import map from './map.json';

export const game = new Game({
    width: window.innerWidth,
    height: window.innerHeight,
    // fps: 1
});


const camera_transform = game.camera.get_component(Transform);
camera_transform.position = [map.starting_point.x, 0.42, map.starting_point.y]
camera_transform.rotation = [-0.067, 0.00169, 0.0001139, 0.9977];
window.camera = camera_transform;
game.camera.get_component(Move).keyboard_controlled = true;
// game.camera.get_component(Move).mouse_controlled = true;

const material = new PhongMaterial({
    requires: [Render, Transform]
});



const plane = new Plane();
const plane_transform = plane.get_component(Transform);
const plane_render = plane.get_component(Render);
plane_transform.scale = [map.size.x, 1, map.size.y];
plane_transform.position = [0.5, -0.5, 0.5];
plane_render.material = material;
plane_render.color = "#ff00ff";
game.add(plane);


const box = new Box();
box.get_component(Transform).position = [0, 0, 3];
window.box_transform = box.get_component(Transform);
box.get_component(Render).material = material;
box.get_component(Render).color = '0F0';
game.add(box);
