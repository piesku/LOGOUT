const vox = require('./vox-parser');
const parser = new vox.Parser();
const palette = require('./palette');
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

parser.parse('./map.vox').then((result) => {
    output_map.size = {
        x: result.size.x,
        y: result.size.y
    };

    const map = result.voxels.reduce((memo, curr) => {
        let current_cell;

        memo[curr.y] = memo[curr.y] || [];

        const cell_type = palette[toHex(result.palette[curr.colorIndex])];

        switch (cell_type) {

            case 'building':
                current_cell = 1;
                break;
            case 'start':
                output_map.starting_point = {
                    x: curr.x,
                    y: curr.y
                };
            case 'empty':
                current_cell = 0;
        }

        memo[curr.y][curr.x] = current_cell;

        return memo;
    }, []);

    map.forEach((row, y) => {
        row.forEach((cell, x) => {
            if (cell === 1) {
                const end_point = find_end(y, x, map);
                output_map.buildings.push({
                    x1: x,
                    y1: y,
                    x2: end_point.x,
                    y2: end_point.y
                });
            }
        });
    });

    console.log(output_map);
    fs.writeFile('./src/map.json', JSON.stringify(output_map), (err) => {
        console.log(err);
    });
});

function find_end(i, j, input) {
    const output = {};
    const x = input.length;
    const y = input[0].length;

    let flag_col = 0;
    let flag_row = 0;

    for (var m = i; m < y; m++) {
        if (input[m][j] !== 1) {
            flag_row = 1;
            break;
        }

        if (input === 5) {
            continue;
        }

        for (var n = j; n < x; n++) {
            if (input[m][n] !== 1) {
                flag_col = 1;
                break;
            }

            input[m][n] = 5;

        }
    }

    if (flag_row === 1) {
        output.y = m - 1;
    } else {
        output.y = m;
    }

    if (flag_col === 1) {
        output.x = n - 1;
    } else {
        output.x = n;
    }

    return output;
}

