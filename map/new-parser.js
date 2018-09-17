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
    // console.log(input[0]);
    // if (!input[0])  {
    //     return;
    // }

    const x = input.length;
    const y = input[0].length;

    let flag_col = 0;
    let flag_row = 0;

    for (var m = i; m < y; m++) {
        if (input[m][j] !== height) {
            flag_row = 1;
            break;
        }

        // if (input[m][j] === 'X') {
        //     continue;
        // }

        for (var n = j; n < x; n++) {
            if (input[m][n] !== height) {
                flag_col = 1;
                break;
            }

            input[m][n] = 0;
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

parser.parse('./city.vox').then((result) => {
    output_map.size = {
        x: result.size.x,
        y: result.size.y
    };

    output_map.starting_point = {
        x: result.size.x / 2,
        y: result.size.y / 2,
    };

    let map = new Array(result.size.x).fill([]);
    map = map.map((row) => {
        return new Array(result.size.x).fill(0);
    });

    map = result.voxels.reduce((memo, curr) => {
        memo[curr.y] = memo[curr.y] || [];
        memo[curr.y][curr.x] = Math.max(memo[curr.y][curr.x] || 0, curr.z);
        return memo;
    }, map);


    // console.log(JSON.stringify(map));
    map.forEach((row, y) => {
        row.forEach((cell, x) => {
            // if (heights.includes(height)) {
            //     return;
            // }

            // heights.push(height);
            if (cell) {
                const end_point = find_end(cell, y, x, map);
                // console.log({
                //     x, y, x2: end_point.x, y2: end_point.y,
                // });
                // process.exit();
                output_map.buildings.push({
                    h: cell,
                    x1: x,
                    y1: y,
                    x2: (end_point.x + 1),
                    y2: (end_point.y + 1),
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
