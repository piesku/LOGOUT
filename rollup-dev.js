import resolve from 'rollup-plugin-node-resolve';
import serve from 'rollup-plugin-serve'
import livereload from 'rollup-plugin-livereload'

export default {
  input: './src/index.js',
  output: {
    file: 'public/game.js',
    format: 'iife',
  },
  plugins: [
    resolve(),
    serve({
      contentBase: ['public']
    }),
    livereload({
      watch: ['src', 'public']
    })
  ],
};
