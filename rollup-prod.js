import resolve from 'rollup-plugin-node-resolve';
import minify from 'rollup-plugin-babel-minify';

export default {
    input: './src/index.js',
    name: 'logout',
    output: {
        file: 'public/game.min.js',
        format: 'iife',
    },
    plugins: [
        resolve(),
        minify({ comments: false }),
    ],
};
