const vox = require('./vox-parser');
const parser = new vox.Parser();
const fs = require('fs');
const UNIT = 1;

const output_map = {
    size: {},
    buildings: [],
    items: []
};

function toHex(obj) {
    const r = obj.r.toString(16).padStart(2, 0);
    const g = obj.g.toString(16).padStart(2, 0);
    const b = obj.b.toString(16).padStart(2, 0);

    return `${r}${g}${b}`.toUpperCase();
}

const checked = [];
function find_end(height, i, j, input) {
    // console.log(height, i, j, input[0][0]);
    const output = {};
    const x = input.length;
    const y = input[0].length;

    let flag_col = 0;
    let flag_row = 0;

    for (var m = i; m < y; m++) {
        if (input[m][j] && input[m][j] !== height) {
            flag_row = 1;
            break;
        }

        // if (checked[m] && checked[m][j] === 5) {
        //     continue;
        // }

        for (var n = j; n < x; n++) {
            if (input[m][n] !== height) {
                flag_col = 1;
                break;
            }

            checked[m] = checked[m] || [];
            checked[m][n] = 5;
        }
    }

    if (flag_row === 1) {
        output.y = m - 1;
    } else {
        output.y = m;
    }
    // console.log(n);
    if (flag_col === 1) {
        output.x = n - 1;
    } else {
        output.x = n;
    }

    return output;
}

parser.parse('./3dmap.vox').then((result) => {
    output_map.size = {
        x: result.size.x,
        y: result.size.y
    };

    const map = result.voxels.reduce((memo, curr) => {
            memo[curr.y] = memo[curr.y] || [];
            memo[curr.y][curr.x] = Math.max(memo[curr.y][curr.x] || 0, curr.z);
            return memo;
        }, []);

    console.log(map);
    map.forEach((row, y) => {
        row.forEach((cell, x) => {
            // if (heights.includes(height)) {
            //     return;
            // }

            // heights.push(height);
            if (cell) {
                const end_point = find_end(cell, y, x, map);
                output_map.buildings.push({
                    height: cell,
                    x1: x * UNIT,
                    y1: y * UNIT,
                    x2: (end_point.x + 1) * UNIT,
                    y2: (end_point.y + 1) * UNIT,
                });
            }
        });
    });

    console.log(output_map);
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
    fs.writeFile('./src/new-map.json', JSON.stringify(output_map), (err) => {
        console.log(err);
    });
});
