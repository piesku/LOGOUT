import resolve from 'rollup-plugin-node-resolve';

export default {
  input: './src/index.js',
  output: {
    file: 'public/game.js',
    format: 'iife',
  },
  plugins: [
    resolve(),
  ],
};
