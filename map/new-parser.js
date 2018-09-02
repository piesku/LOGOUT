const vox = require('./vox-parser');
const parser = new vox.Parser();
const fs = require('fs');

const output_map = {
    size: {},
    buildings: [],
    items: [],
    starting_point: {}
};

function toHex(obj) {
    const r = obj.r.toString(16).padStart(2, 0);
    const g = obj.g.toString(16).padStart(2, 0);
    const b = obj.b.toString(16).padStart(2, 0);

    return `${r}${g}${b}`.toUpperCase();
}

parser.parse('./3dmap.vox').then((result) => {
    output_map.size = {
        x: result.size.x,
        y: result.size.y
    };

    let output = {
        map: result.voxels.reduce((memo, curr) => {
            memo[curr.y] = memo[curr.y] || [];
            memo[curr.y][curr.x] = Math.max(memo[curr.y][curr.x] || 0, curr.z);
            return memo;
        }, [])
    };
    // const map = result.voxels.reduce((memo, curr) => {
    //     let current_cell;

    //     memo[curr.y] = memo[curr.y] || [];

    //     const cell_type = palette[toHex(result.palette[curr.colorIndex])];

    //     switch (cell_type) {

    //         case 'building':
    //             current_cell = 1;
    //             break;
    //         case 'start':
    //             output_map.starting_point = {
    //                 x: curr.x,
    //                 y: curr.y
    //             };
    //         case 'empty':
    //             current_cell = 0;
    //     }

    //     memo[curr.y][curr.x] = current_cell;

    //     return memo;
    // }, []);

    // map.forEach((row, y) => {
    //     row.forEach((cell, x) => {
    //         if (cell === 1) {
    //             const end_point = find_end(y, x, map);
    //             output_map.buildings.push({
    //                 x1: x,
    //                 y1: y,
    //                 x2: end_point.x,
    //                 y2: end_point.y
    //             });
    //         }
    //     });
    // });

    // console.log(output_map);
    fs.writeFile('./src/new-map.json', JSON.stringify(output), (err) => {
        console.log(err);
    });
});
