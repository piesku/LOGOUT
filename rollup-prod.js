import resolve from 'rollup-plugin-node-resolve';
import minify from 'rollup-plugin-babel-minify';
import json from 'rollup-plugin-json';

export default {
  input: './src/index.js',
  output: {
    file: 'public/game.min.js',
    format: 'iife',
  },
  plugins: [
    resolve(),
    minify({ comments: false }),
    json(),
  ],
};
