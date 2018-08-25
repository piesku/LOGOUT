import resolve from 'rollup-plugin-node-resolve';
import serve from 'rollup-plugin-serve'
import livereload from 'rollup-plugin-livereload'
import json from 'rollup-plugin-json';

export default {
    input: './src/index.js',
    name: 'logout',
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
        }),
        json()
    ],
};
