import { fragment as fragment_shader } from './cervus/shaders';

// Generate animated code display
function *generateCode() {
    let lines = fragment_shader.toString()
        .split("\n").slice(7, -2)
        .map(line => line.trim())
        .filter(Boolean);
    let i = 0;
    while (1) {
        yield lines[i++ % lines.length];
    }
}

export default generateCode();
