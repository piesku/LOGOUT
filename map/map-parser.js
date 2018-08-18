const vox = require('./vox-parser');

const parser = new vox.Parser();

function toHex(obj) {
    const r = obj.r.toString(16).padStart(2, 0);
    const g = obj.g.toString(16).padStart(2, 0);
    const b = obj.b.toString(16).padStart(2, 0);

    return `${r}${g}${b}`.toUpperCase();
}

parser.parse('./map.vox').then((result) => {
    const width = result.size.x;
    const map = result.voxels.reduce((memo, curr) => {
        memo[curr.x] = memo[curr.x] || [];
        memo[curr.x][curr.y] = toHex(result.palette[curr.colorIndex]);

        return memo;
    }, []);

    console.log({map});
});
