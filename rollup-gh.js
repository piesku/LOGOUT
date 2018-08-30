import resolve from 'rollup-plugin-node-resolve';
import json from 'rollup-plugin-json';

export default {
  input: './src/index.js',
  output: {
    file: 'public/game.js',
    format: 'iife',
  },
  plugins: [
    resolve(),
    json(),
  ],
};
