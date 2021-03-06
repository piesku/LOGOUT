import { Component } from '../core';

import { hex_to_rgb } from '../utils';


let default_options = {
  intensity: 0.5,
  color: '#ffffff'
}

export class Light extends Component {
  constructor(options) {
    super(Object.assign(default_options, options));
  }

  set color(hex) {
    this._color = hex || 'fff';
    this.color_vec = [...hex_to_rgb(this._color)];
  }

  get color() {
    return this._color;
  }
}
