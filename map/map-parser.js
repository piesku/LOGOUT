const vox = require('./vox-parser');
const parser = new vox.Parser();
const palette = require('./palette');

const output_map = {
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
    const width = result.size.x;
    const map = result.voxels.reduce((memo, curr) => {
        let current_cell;

        memo[curr.x] = memo[curr.x] || [];

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

        memo[curr.x][curr.y] = current_cell;

        return memo;
    }, []);

    console.log(map);
});

function find_end(i, j, input) {
    const output = {};
    const x = input.length;
    const y = input[0].length;

    let flag_col = 0;
    let flag_row = 0;

    for (var m = i; m < x; m++) {
        if (input[m][j] != 1) {
            flag_row = 1;
            break;
        }

        if (input === 5) {
            continue;
        }

        for (var n = j; n < y; n++) {
            if (input[m][n] != 1) {
                flag_col = 1;
                break;
            }

            input[m][n] = 5;

        }
    }

    if (flag_row === 1) {
        output.x = m - 1;
    } else {
        output.x = m;
    }


    if (flag_col === 1) {
        output.y = n - 1;
    } else {
        output.y = n;
    }

    return output;
}

