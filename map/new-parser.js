const vox = require('./vox-parser');
const parser = new vox.Parser();
const fs = require('fs');

const BLOCK_COLOR = '99CCFF';
const END_COLOR = 'FFFFFF';

const POWERUP_MAP = {
    "320000": 'CLOCK',
    "640000": 'COMPASS',
    "960000": 'SOLID',
    "C80000": 'COLOR',
    "FF0000": 'MOUSELOOK',
};

const output_map = {
    size: [],
    buildings: [],
    start: [],
    end: [],
    items: []
};

function toHex(obj) {
    const r = obj.r.toString(16).padStart(2, 0);
    const g = obj.g.toString(16).padStart(2, 0);
    const b = obj.b.toString(16).padStart(2, 0);

    return `${r}${g}${b}`.toUpperCase();
}

function find_end(height, i, j, input) {
    const x = input.length;
    const y = input[0].length;

    for (var m = i; m < y; m++) {
        if (input[m][j] !== height) {
            break;
        }

        for (var n = j; n < x; n++) {
            if (input[m][n] !== height) {
                break;
            }

            input[m][n] = 0;
        }
    }

    return {
        x: n - 1,
        y: m - 1,
    };
}

parser.parse('./city.vox').then((result) => {
    output_map.size = [
        result.size.x,
        result.size.y,
    ];

    output_map.start = [
        result.size.x / 2,
        result.size.y / 2,
    ];

    let map = new Array(result.size.x).fill([]);
    map = map.map((row) => {
        return new Array(result.size.x).fill(0);
    });

    map = result.voxels.reduce((memo, curr) => {
        const vox_color = toHex(result.palette[curr.colorIndex]);
        const powerup_type = POWERUP_MAP[vox_color];

        if (powerup_type) {
            output_map.items.push([
                powerup_type,
                result.size.x - curr.x,
                curr.y
            ]);
        } else if (vox_color === END_COLOR) {
            output_map.end = [
                result.size.x - curr.x,
                curr.y
            ];
        } else {
            memo[curr.y] = memo[curr.y] || [];
            memo[curr.y][curr.x] = Math.max(memo[curr.y][curr.x] || 1, curr.z + 1);
        }
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
                output_map.buildings.push([
                    result.size.x - end_point.x - 1,
                    y,
                    result.size.x - x,
                    end_point.y + 1,
                    cell,
                ]);
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
