import { vec3 } from "../math";
export let base_seed = 19870306 * 6647088;

let seed = base_seed;

export function set_seed(new_seed) {
  seed = new_seed;
}

let rand = function() {
  seed = seed * 16807 % 2147483647;
  return (seed - 1) / 2147483646;
};

export function integer(min = 0, max = 1) {
  return Math.floor(rand() * (max - min + 1) + min);
}

export function float(min = 0, max = 1) {
  return rand() * (max - min) + min;
}

export function element_of(arr) {
  return arr[integer(0, arr.length - 1)];
}

/*
 * Random position inside of a circle.
 */
export function position([x, z], max_radius, y = 1.5) {
  let angle = float(0, Math.PI * 2);
  let radius = float(0, max_radius);
  return vec3.of(
    x + radius * Math.cos(angle),
    y,
    z + radius * Math.sin(angle)
  );
}
