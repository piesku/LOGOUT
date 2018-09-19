(function () {
'use strict';

class Component {
    before() {}
    render() {}
    after() {}
}

var createStore = function(reducer) {
    let state = reducer();

    let phase;
    let root;
    let app;

    function renderComponent(component) {
        if (component instanceof Component) {
            let output = component.render();
            switch (phase) {
                case "BEFORE":
                    return component.before(root);
                case "AFTER":
                    return component.after(root);
                default:
                    return output;
            }
        }

        // All other types are handled in html.
        return component;
    }


    function renderRoots(nextState) {
        let prevState = state;

        phase = "BEFORE";
        state = prevState;
        renderComponent(app());

        phase = "RENDER";
        state = nextState;
        root.innerHTML = renderComponent(app());

        phase = "AFTER";
        state = nextState;
        renderComponent(app());
    }

    return {
        attach(_app, _root) {
            root = _root;
            app = _app;
            renderRoots(state);
        },
        connect(component) {
            // Return a decorated component function.
            return (...args) => component(state, ...args);
        },
        dispatch(action, ...args) {
            let nextState = reducer(state, action, args);
            renderRoots(nextState);
        },
        html([first, ...strings], ...values) {
            // Weave the literal strings and the interpolations.
            // We don't have to explicitly handle array-typed values
            // because concat will spread them flat for us.
            return values.reduce(
                (acc, cur) =>
                    acc.concat(
                        renderComponent(cur),
                        strings.shift()),
                [first])

                // Filter out interpolations which are bools, null or undefined.
                .filter(x => x && x !== true || x === 0)
                .join("");
        },
    };
};

let HUD = "Heads-Up Display";
let PERSPECTIVE = "Perspective";
let SOLID = "Light Sensor";
let COLOR = "Chromatic Sampling";
let CLOCK = "Low-Res Timer";
let COMPASS = "Compass";
let MOUSELOOK = "Gimbal Mount";
let GRID = "WASD Movement";


var sys = Object.freeze({
	HUD: HUD,
	PERSPECTIVE: PERSPECTIVE,
	SOLID: SOLID,
	COLOR: COLOR,
	CLOCK: CLOCK,
	COMPASS: COMPASS,
	MOUSELOOK: MOUSELOOK,
	GRID: GRID
});

let DIAGNOSTIC = 0;
let START = 1;
let ACTIVATE = 2;
let EXIT = 3;

function hex_to_rgb(hex) {
  if (hex.charAt(0) === '#') {
    hex = hex.substr(1);
  }

  if (hex.length === 3) {
    hex = hex.split('').map(
      el => el + el
    ).join('');
  }

  return hex.match(/.{1,2}/g).map(
    el => parseFloat((parseInt(el, 16) / 255).toFixed(2))
  );
}

function rgb_to_hex(vec) {
  return vec.reduce((sum, value) => {
    let val = (~~(value * 255)).toString(16);

    if (val.length === 1) {
      val = '0' + val;
    }

    return sum + val;
  }, '#');
}


/**
 * Converts an HSL color value to RGB. Conversion formula
 * adapted from http://en.wikipedia.org/wiki/HSL_color_space.
 * Assumes h, s, and l are contained in the set [0, 1] and
 * returns r, g, and b in the set [0, 1].
 *
 * Credit: https://gist.github.com/mjackson/5311256
 *
 * @param   Number  h       The hue
 * @param   Number  s       The saturation
 * @param   Number  l       The lightness
 * @return  Array           The RGB representation
 */
function hsl_to_rgb(h, s, l) {
  let r, g, b;

  if (s == 0) {
    r = g = b = l; // achromatic
  } else {
    function hue2rgb(p, q, t) {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1/6) return p + (q - p) * 6 * t;
      if (t < 1/2) return q;
      if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
      return p;
    }

    let q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    let p = 2 * l - q;

    r = hue2rgb(p, q, h + 1/3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1/3);
  }

  return [r, g, b];
}

/**
 * Converts an HSV color value to RGB. Conversion formula
 * adapted from http://en.wikipedia.org/wiki/HSV_color_space.
 * Assumes h, s, and v are contained in the set [0, 1] and
 * returns r, g, and b in the set [0, 1].
 *
 * Credit: https://gist.github.com/mjackson/5311256
 *
 * @param   Number  h       The hue
 * @param   Number  s       The saturation
 * @param   Number  v       The value
 * @return  Array           The RGB representation
 */

/**
 * Common utilities
 * @module glMatrix
 */

// Configuration Constants
const EPSILON = 0.000001;
let ARRAY_TYPE = (typeof Float32Array !== 'undefined') ? Float32Array : Array;


/**
 * Sets the type of array used when creating new vectors and matrices
 *
 * @param {Type} type Array type, such as Float32Array or Array
 */


/**
 * Convert Degree To Radian
 *
 * @param {Number} a Angle in Degrees
 */


/**
 * Tests whether or not the arguments have approximately the same value, within an absolute
 * or relative tolerance of glMatrix.EPSILON (an absolute tolerance is used for values less
 * than or equal to 1.0, and a relative tolerance is used for larger values)
 *
 * @param {Number} a The first number to test.
 * @param {Number} b The second number to test.
 * @returns {Boolean} True if the numbers are approximately equal, false otherwise.
 */

/**
 * 3 Dimensional Vector
 * @module vec3
 */

/**
 * Creates a new, empty vec3
 *
 * @returns {vec3} a new 3D vector
 */
function create() {
  let out = new ARRAY_TYPE(3);
  if(ARRAY_TYPE != Float32Array) {
    out[0] = 0;
    out[1] = 0;
    out[2] = 0;
  }
  return out;
}

/**
 * Creates a new vec3 initialized with values from an existing vector
 *
 * @param {vec3} a vector to clone
 * @returns {vec3} a new 3D vector
 */


/**
 * Calculates the length of a vec3
 *
 * @param {vec3} a vector to calculate length of
 * @returns {Number} length of a
 */
function length(a) {
  let x = a[0];
  let y = a[1];
  let z = a[2];
  return Math.sqrt(x*x + y*y + z*z);
}

/**
 * Creates a new vec3 initialized with the given values
 *
 * @param {Number} x X component
 * @param {Number} y Y component
 * @param {Number} z Z component
 * @returns {vec3} a new 3D vector
 */
function fromValues(x, y, z) {
  let out = new ARRAY_TYPE(3);
  out[0] = x;
  out[1] = y;
  out[2] = z;
  return out;
}

/**
 * Copy the values from one vec3 to another
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the source vector
 * @returns {vec3} out
 */


/**
 * Set the components of a vec3 to the given values
 *
 * @param {vec3} out the receiving vector
 * @param {Number} x X component
 * @param {Number} y Y component
 * @param {Number} z Z component
 * @returns {vec3} out
 */


/**
 * Adds two vec3's
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the first operand
 * @param {vec3} b the second operand
 * @returns {vec3} out
 */
function add(out, a, b) {
  out[0] = a[0] + b[0];
  out[1] = a[1] + b[1];
  out[2] = a[2] + b[2];
  return out;
}

/**
 * Subtracts vector b from vector a
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the first operand
 * @param {vec3} b the second operand
 * @returns {vec3} out
 */
function subtract(out, a, b) {
  out[0] = a[0] - b[0];
  out[1] = a[1] - b[1];
  out[2] = a[2] - b[2];
  return out;
}

/**
 * Multiplies two vec3's
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the first operand
 * @param {vec3} b the second operand
 * @returns {vec3} out
 */


/**
 * Divides two vec3's
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the first operand
 * @param {vec3} b the second operand
 * @returns {vec3} out
 */


/**
 * Math.ceil the components of a vec3
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a vector to ceil
 * @returns {vec3} out
 */


/**
 * Math.floor the components of a vec3
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a vector to floor
 * @returns {vec3} out
 */


/**
 * Returns the minimum of two vec3's
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the first operand
 * @param {vec3} b the second operand
 * @returns {vec3} out
 */


/**
 * Returns the maximum of two vec3's
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the first operand
 * @param {vec3} b the second operand
 * @returns {vec3} out
 */


/**
 * Math.round the components of a vec3
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a vector to round
 * @returns {vec3} out
 */


/**
 * Scales a vec3 by a scalar number
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the vector to scale
 * @param {Number} b amount to scale the vector by
 * @returns {vec3} out
 */
function scale(out, a, b) {
  out[0] = a[0] * b;
  out[1] = a[1] * b;
  out[2] = a[2] * b;
  return out;
}

/**
 * Adds two vec3's after scaling the second operand by a scalar value
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the first operand
 * @param {vec3} b the second operand
 * @param {Number} scale the amount to scale b by before adding
 * @returns {vec3} out
 */


/**
 * Calculates the euclidian distance between two vec3's
 *
 * @param {vec3} a the first operand
 * @param {vec3} b the second operand
 * @returns {Number} distance between a and b
 */
function distance(a, b) {
  let x = b[0] - a[0];
  let y = b[1] - a[1];
  let z = b[2] - a[2];
  return Math.sqrt(x*x + y*y + z*z);
}

/**
 * Calculates the squared euclidian distance between two vec3's
 *
 * @param {vec3} a the first operand
 * @param {vec3} b the second operand
 * @returns {Number} squared distance between a and b
 */


/**
 * Calculates the squared length of a vec3
 *
 * @param {vec3} a vector to calculate squared length of
 * @returns {Number} squared length of a
 */


/**
 * Negates the components of a vec3
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a vector to negate
 * @returns {vec3} out
 */


/**
 * Returns the inverse of the components of a vec3
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a vector to invert
 * @returns {vec3} out
 */


/**
 * Normalize a vec3
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a vector to normalize
 * @returns {vec3} out
 */
function normalize(out, a) {
  let x = a[0];
  let y = a[1];
  let z = a[2];
  let len = x*x + y*y + z*z;
  if (len > 0) {
    //TODO: evaluate use of glm_invsqrt here?
    len = 1 / Math.sqrt(len);
    out[0] = a[0] * len;
    out[1] = a[1] * len;
    out[2] = a[2] * len;
  }
  return out;
}

/**
 * Calculates the dot product of two vec3's
 *
 * @param {vec3} a the first operand
 * @param {vec3} b the second operand
 * @returns {Number} dot product of a and b
 */
function dot(a, b) {
  return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
}

/**
 * Computes the cross product of two vec3's
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the first operand
 * @param {vec3} b the second operand
 * @returns {vec3} out
 */
function cross(out, a, b) {
  let ax = a[0], ay = a[1], az = a[2];
  let bx = b[0], by = b[1], bz = b[2];

  out[0] = ay * bz - az * by;
  out[1] = az * bx - ax * bz;
  out[2] = ax * by - ay * bx;
  return out;
}

/**
 * Performs a linear interpolation between two vec3's
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the first operand
 * @param {vec3} b the second operand
 * @param {Number} t interpolation amount, in the range [0-1], between the two inputs
 * @returns {vec3} out
 */


/**
 * Performs a hermite interpolation with two control points
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the first operand
 * @param {vec3} b the second operand
 * @param {vec3} c the third operand
 * @param {vec3} d the fourth operand
 * @param {Number} t interpolation amount, in the range [0-1], between the two inputs
 * @returns {vec3} out
 */


/**
 * Performs a bezier interpolation with two control points
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the first operand
 * @param {vec3} b the second operand
 * @param {vec3} c the third operand
 * @param {vec3} d the fourth operand
 * @param {Number} t interpolation amount, in the range [0-1], between the two inputs
 * @returns {vec3} out
 */


/**
 * Generates a random vector with the given scale
 *
 * @param {vec3} out the receiving vector
 * @param {Number} [scale] Length of the resulting vector. If ommitted, a unit vector will be returned
 * @returns {vec3} out
 */


/**
 * Transforms the vec3 with a mat4.
 * 4th vector component is implicitly '1'
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the vector to transform
 * @param {mat4} m matrix to transform with
 * @returns {vec3} out
 */


/**
 * Transforms the vec3 with a mat3.
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the vector to transform
 * @param {mat3} m the 3x3 matrix to transform with
 * @returns {vec3} out
 */


/**
 * Transforms the vec3 with a quat
 * Can also be used for dual quaternions. (Multiply it with the real part)
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the vector to transform
 * @param {quat} q quaternion to transform with
 * @returns {vec3} out
 */


/**
 * Rotate a 3D vector around the x-axis
 * @param {vec3} out The receiving vec3
 * @param {vec3} a The vec3 point to rotate
 * @param {vec3} b The origin of the rotation
 * @param {Number} c The angle of rotation
 * @returns {vec3} out
 */


/**
 * Rotate a 3D vector around the y-axis
 * @param {vec3} out The receiving vec3
 * @param {vec3} a The vec3 point to rotate
 * @param {vec3} b The origin of the rotation
 * @param {Number} c The angle of rotation
 * @returns {vec3} out
 */


/**
 * Rotate a 3D vector around the z-axis
 * @param {vec3} out The receiving vec3
 * @param {vec3} a The vec3 point to rotate
 * @param {vec3} b The origin of the rotation
 * @param {Number} c The angle of rotation
 * @returns {vec3} out
 */


/**
 * Get the angle between two 3D vectors
 * @param {vec3} a The first operand
 * @param {vec3} b The second operand
 * @returns {Number} The angle in radians
 */
function angle(a, b) {
  let tempA = fromValues(a[0], a[1], a[2]);
  let tempB = fromValues(b[0], b[1], b[2]);

  normalize(tempA, tempA);
  normalize(tempB, tempB);

  let cosine = dot(tempA, tempB);

  if(cosine > 1.0) {
    return 0;
  }
  else if(cosine < -1.0) {
    return Math.PI;
  } else {
    return Math.acos(cosine);
  }
}

/**
 * Returns a string representation of a vector
 *
 * @param {vec3} a vector to represent as a string
 * @returns {String} string representation of the vector
 */


/**
 * Returns whether or not the vectors have exactly the same elements in the same position (when compared with ===)
 *
 * @param {vec3} a The first vector.
 * @param {vec3} b The second vector.
 * @returns {Boolean} True if the vectors are equal, false otherwise.
 */


/**
 * Returns whether or not the vectors have approximately the same elements in the same position.
 *
 * @param {vec3} a The first vector.
 * @param {vec3} b The second vector.
 * @returns {Boolean} True if the vectors are equal, false otherwise.
 */


/**
 * Alias for {@link vec3.subtract}
 * @function
 */


/**
 * Alias for {@link vec3.multiply}
 * @function
 */


/**
 * Alias for {@link vec3.divide}
 * @function
 */


/**
 * Alias for {@link vec3.distance}
 * @function
 */


/**
 * Alias for {@link vec3.squaredDistance}
 * @function
 */


/**
 * Alias for {@link vec3.length}
 * @function
 */
const len = length;

/**
 * Alias for {@link vec3.squaredLength}
 * @function
 */


/**
 * Perform some operation over an array of vec3s.
 *
 * @param {Array} a the array of vectors to iterate over
 * @param {Number} stride Number of elements between the start of each vec3. If 0 assumes tightly packed
 * @param {Number} offset Number of elements to skip at the beginning of the array
 * @param {Number} count Number of vec3s to iterate over. If 0 iterates over entire array
 * @param {Function} fn Function to call for each vector in the array
 * @param {Object} [arg] additional argument to pass to fn
 * @returns {Array} a
 * @function
 */
const forEach = (function() {
  let vec = create();

  return function(a, stride, offset, count, fn, arg) {
    let i, l;
    if(!stride) {
      stride = 3;
    }

    if(!offset) {
      offset = 0;
    }

    if(count) {
      l = Math.min((count * stride) + offset, a.length);
    } else {
      l = a.length;
    }

    for(i = offset; i < l; i += stride) {
      vec[0] = a[i]; vec[1] = a[i+1]; vec[2] = a[i+2];
      fn(vec, vec, arg);
      a[i] = vec[0]; a[i+1] = vec[1]; a[i+2] = vec[2];
    }

    return a;
  };
})();

let V = Float32Array;

let zero = V.of(0, 0, 0);
let unit = V.of(1, 1, 1);
let left = V.of(1, 0, 0);
let up = V.of(0, 1, 0);
let forward = V.of(0, 0, 1);

let of = (...vals) => V.of(...vals);

function transform_mat4(out, vec, mat) {
  let [x, y, z] = vec;
  let res = mat.transformPoint({x, y, z});
  out[0] = res.x;
  out[1] = res.y;
  out[2] = res.z;
  return out;

}

let EPSILON$1 = 0.000001;

function create$1() {
    return new DOMMatrix();
}

function clone$1(m) {
    return new DOMMatrix(m);
}

function set$1(m, values) {
    m.m11 = values[0];
    m.m12 = values[1];
    m.m13 = values[2];
    m.m14 = values[3];
    m.m21 = values[4];
    m.m22 = values[5];
    m.m23 = values[6];
    m.m24 = values[7];
    m.m31 = values[8];
    m.m32 = values[9];
    m.m33 = values[10];
    m.m34 = values[11];
    m.m41 = values[12];
    m.m42 = values[13];
    m.m43 = values[14];
    m.m44 = values[15];
    return m;
}

function multiply$1(a, b) {
    return a.multiply(b);
}

function invert(m) {
    return m.inverse();
}

function ortho(out, left, right, bottom, top, near, far) {
    let lr = 1 / (left - right);
    let bt = 1 / (bottom - top);
    let nf = 1 / (near - far);
    return set$1(out, [
        -2 * lr,
        0,
        0,
        0,
        0,
        -2 * bt,
        0,
        0,
        0,
        0,
        2 * nf,
        0,
        (left + right) * lr,
        (top + bottom) * bt,
        (far + near) * nf,
        1
    ]);
}

function perspective(out, fovy, aspect, near, far) {
    let f = 1.0 / Math.tan(fovy / 2), nf;
    set$1(out, [
        f / aspect,
        0,
        0,
        0,
        0,
        f,
        0,
        0,
        0,
        0,
        0, // set below
        -1,
        0,
        0,
        0, // set below
        0
    ]);

    if (far != null && far !== Infinity) {
        nf = 1 / (near - far);
        out.m33 = (far + near) * nf;
        out.m43 = (2 * far * near) * nf;
    } else {
        out.m33 = -1;
        out.m43 = -2 * near;
    }

    return out;
}

function look_at(out, eye, center, up) {
    let x0, x1, x2, y0, y1, y2, z0, z1, z2, len;
    let eyex = eye[0];
    let eyey = eye[1];
    let eyez = eye[2];
    let upx = up[0];
    let upy = up[1];
    let upz = up[2];
    let centerx = center[0];
    let centery = center[1];
    let centerz = center[2];

    if (Math.abs(eyex - centerx) < EPSILON$1 &&
        Math.abs(eyey - centery) < EPSILON$1 &&
        Math.abs(eyez - centerz) < EPSILON$1) {
        return identity(out);
    }

    z0 = eyex - centerx;
    z1 = eyey - centery;
    z2 = eyez - centerz;

    len = 1 / Math.sqrt(z0 * z0 + z1 * z1 + z2 * z2);
    z0 *= len;
    z1 *= len;
    z2 *= len;

    x0 = upy * z2 - upz * z1;
    x1 = upz * z0 - upx * z2;
    x2 = upx * z1 - upy * z0;
    len = Math.sqrt(x0 * x0 + x1 * x1 + x2 * x2);
    if (!len) {
        x0 = 0;
        x1 = 0;
        x2 = 0;
    } else {
        len = 1 / len;
        x0 *= len;
        x1 *= len;
        x2 *= len;
    }

    y0 = z1 * x2 - z2 * x1;
    y1 = z2 * x0 - z0 * x2;
    y2 = z0 * x1 - z1 * x0;

    len = Math.sqrt(y0 * y0 + y1 * y1 + y2 * y2);
    if (!len) {
        y0 = 0;
        y1 = 0;
        y2 = 0;
    } else {
        len = 1 / len;
        y0 *= len;
        y1 *= len;
        y2 *= len;
    }

    return set$1(out, [
        x0,
        y0,
        z0,
        0,
        x1,
        y1,
        z1,
        0,
        x2,
        y2,
        z2,
        0,
        -(x0 * eyex + x1 * eyey + x2 * eyez),
        -(y0 * eyex + y1 * eyey + y2 * eyez),
        -(z0 * eyex + z1 * eyey + z2 * eyez),
        1,
    ]);
}



function compose(out, q, v, s) {
    // Quaternion math
    let x = q[0], y = q[1], z = q[2], w = q[3];
    let x2 = x + x;
    let y2 = y + y;
    let z2 = z + z;

    let xx = x * x2;
    let xy = x * y2;
    let xz = x * z2;
    let yy = y * y2;
    let yz = y * z2;
    let zz = z * z2;
    let wx = w * x2;
    let wy = w * y2;
    let wz = w * z2;
    let sx = s[0];
    let sy = s[1];
    let sz = s[2];

    return set$1(out, [
        (1 - (yy + zz)) * sx,
        (xy + wz) * sx,
        (xz - wy) * sx,
        0,
        (xy - wz) * sy,
        (1 - (xx + zz)) * sy,
        (yz + wx) * sy,
        0,
        (xz + wy) * sz,
        (yz - wx) * sz,
        (1 - (xx + yy)) * sz,
        0,
        v[0],
        v[1],
        v[2],
        1
    ]);
}

/**
 * 3x3 Matrix
 * @module mat3
 */

/**
 * Creates a new identity mat3
 *
 * @returns {mat3} a new 3x3 matrix
 */
function create$3() {
  let out = new ARRAY_TYPE(9);
  if(ARRAY_TYPE != Float32Array) {
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[5] = 0;
    out[6] = 0;
    out[7] = 0;
  }
  out[0] = 1;
  out[4] = 1;
  out[8] = 1;
  return out;
}

/**
 * Copies the upper-left 3x3 values into the given mat3.
 *
 * @param {mat3} out the receiving 3x3 matrix
 * @param {mat4} a   the source 4x4 matrix
 * @returns {mat3} out
 */


/**
 * Creates a new mat3 initialized with values from an existing matrix
 *
 * @param {mat3} a matrix to clone
 * @returns {mat3} a new 3x3 matrix
 */


/**
 * Copy the values from one mat3 to another
 *
 * @param {mat3} out the receiving matrix
 * @param {mat3} a the source matrix
 * @returns {mat3} out
 */


/**
 * Create a new mat3 with the given values
 *
 * @param {Number} m00 Component in column 0, row 0 position (index 0)
 * @param {Number} m01 Component in column 0, row 1 position (index 1)
 * @param {Number} m02 Component in column 0, row 2 position (index 2)
 * @param {Number} m10 Component in column 1, row 0 position (index 3)
 * @param {Number} m11 Component in column 1, row 1 position (index 4)
 * @param {Number} m12 Component in column 1, row 2 position (index 5)
 * @param {Number} m20 Component in column 2, row 0 position (index 6)
 * @param {Number} m21 Component in column 2, row 1 position (index 7)
 * @param {Number} m22 Component in column 2, row 2 position (index 8)
 * @returns {mat3} A new mat3
 */


/**
 * Set the components of a mat3 to the given values
 *
 * @param {mat3} out the receiving matrix
 * @param {Number} m00 Component in column 0, row 0 position (index 0)
 * @param {Number} m01 Component in column 0, row 1 position (index 1)
 * @param {Number} m02 Component in column 0, row 2 position (index 2)
 * @param {Number} m10 Component in column 1, row 0 position (index 3)
 * @param {Number} m11 Component in column 1, row 1 position (index 4)
 * @param {Number} m12 Component in column 1, row 2 position (index 5)
 * @param {Number} m20 Component in column 2, row 0 position (index 6)
 * @param {Number} m21 Component in column 2, row 1 position (index 7)
 * @param {Number} m22 Component in column 2, row 2 position (index 8)
 * @returns {mat3} out
 */


/**
 * Set a mat3 to the identity matrix
 *
 * @param {mat3} out the receiving matrix
 * @returns {mat3} out
 */


/**
 * Transpose the values of a mat3
 *
 * @param {mat3} out the receiving matrix
 * @param {mat3} a the source matrix
 * @returns {mat3} out
 */


/**
 * Inverts a mat3
 *
 * @param {mat3} out the receiving matrix
 * @param {mat3} a the source matrix
 * @returns {mat3} out
 */


/**
 * Calculates the adjugate of a mat3
 *
 * @param {mat3} out the receiving matrix
 * @param {mat3} a the source matrix
 * @returns {mat3} out
 */


/**
 * Calculates the determinant of a mat3
 *
 * @param {mat3} a the source matrix
 * @returns {Number} determinant of a
 */


/**
 * Multiplies two mat3's
 *
 * @param {mat3} out the receiving matrix
 * @param {mat3} a the first operand
 * @param {mat3} b the second operand
 * @returns {mat3} out
 */


/**
 * Translate a mat3 by the given vector
 *
 * @param {mat3} out the receiving matrix
 * @param {mat3} a the matrix to translate
 * @param {vec2} v vector to translate by
 * @returns {mat3} out
 */


/**
 * Rotates a mat3 by the given angle
 *
 * @param {mat3} out the receiving matrix
 * @param {mat3} a the matrix to rotate
 * @param {Number} rad the angle to rotate the matrix by
 * @returns {mat3} out
 */


/**
 * Scales the mat3 by the dimensions in the given vec2
 *
 * @param {mat3} out the receiving matrix
 * @param {mat3} a the matrix to rotate
 * @param {vec2} v the vec2 to scale the matrix by
 * @returns {mat3} out
 **/


/**
 * Creates a matrix from a vector translation
 * This is equivalent to (but much faster than):
 *
 *     mat3.identity(dest);
 *     mat3.translate(dest, dest, vec);
 *
 * @param {mat3} out mat3 receiving operation result
 * @param {vec2} v Translation vector
 * @returns {mat3} out
 */


/**
 * Creates a matrix from a given angle
 * This is equivalent to (but much faster than):
 *
 *     mat3.identity(dest);
 *     mat3.rotate(dest, dest, rad);
 *
 * @param {mat3} out mat3 receiving operation result
 * @param {Number} rad the angle to rotate the matrix by
 * @returns {mat3} out
 */


/**
 * Creates a matrix from a vector scaling
 * This is equivalent to (but much faster than):
 *
 *     mat3.identity(dest);
 *     mat3.scale(dest, dest, vec);
 *
 * @param {mat3} out mat3 receiving operation result
 * @param {vec2} v Scaling vector
 * @returns {mat3} out
 */


/**
 * Copies the values from a mat2d into a mat3
 *
 * @param {mat3} out the receiving matrix
 * @param {mat2d} a the matrix to copy
 * @returns {mat3} out
 **/


/**
* Calculates a 3x3 matrix from the given quaternion
*
* @param {mat3} out mat3 receiving operation result
* @param {quat} q Quaternion to create matrix from
*
* @returns {mat3} out
*/


/**
* Calculates a 3x3 normal matrix (transpose inverse) from the 4x4 matrix
*
* @param {mat3} out mat3 receiving operation result
* @param {mat4} a Mat4 to derive the normal matrix from
*
* @returns {mat3} out
*/


/**
 * Generates a 2D projection matrix with the given bounds
 *
 * @param {mat3} out mat3 frustum matrix will be written into
 * @param {number} width Width of your gl context
 * @param {number} height Height of gl context
 * @returns {mat3} out
 */


/**
 * Returns a string representation of a mat3
 *
 * @param {mat3} a matrix to represent as a string
 * @returns {String} string representation of the matrix
 */


/**
 * Returns Frobenius norm of a mat3
 *
 * @param {mat3} a the matrix to calculate Frobenius norm of
 * @returns {Number} Frobenius norm
 */


/**
 * Adds two mat3's
 *
 * @param {mat3} out the receiving matrix
 * @param {mat3} a the first operand
 * @param {mat3} b the second operand
 * @returns {mat3} out
 */


/**
 * Subtracts matrix b from matrix a
 *
 * @param {mat3} out the receiving matrix
 * @param {mat3} a the first operand
 * @param {mat3} b the second operand
 * @returns {mat3} out
 */




/**
 * Multiply each element of the matrix by a scalar.
 *
 * @param {mat3} out the receiving matrix
 * @param {mat3} a the matrix to scale
 * @param {Number} b amount to scale the matrix's elements by
 * @returns {mat3} out
 */


/**
 * Adds two mat3's after multiplying each element of the second operand by a scalar value.
 *
 * @param {mat3} out the receiving vector
 * @param {mat3} a the first operand
 * @param {mat3} b the second operand
 * @param {Number} scale the amount to scale b's elements by before adding
 * @returns {mat3} out
 */


/**
 * Returns whether or not the matrices have exactly the same elements in the same position (when compared with ===)
 *
 * @param {mat3} a The first matrix.
 * @param {mat3} b The second matrix.
 * @returns {Boolean} True if the matrices are equal, false otherwise.
 */


/**
 * Returns whether or not the matrices have approximately the same elements in the same position.
 *
 * @param {mat3} a The first matrix.
 * @param {mat3} b The second matrix.
 * @returns {Boolean} True if the matrices are equal, false otherwise.
 */


/**
 * Alias for {@link mat3.multiply}
 * @function
 */


/**
 * Alias for {@link mat3.subtract}
 * @function
 */

/**
 * 4 Dimensional Vector
 * @module vec4
 */

/**
 * Creates a new, empty vec4
 *
 * @returns {vec4} a new 4D vector
 */
function create$4() {
  let out = new ARRAY_TYPE(4);
  if(ARRAY_TYPE != Float32Array) {
    out[0] = 0;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
  }
  return out;
}

/**
 * Creates a new vec4 initialized with values from an existing vector
 *
 * @param {vec4} a vector to clone
 * @returns {vec4} a new 4D vector
 */


/**
 * Creates a new vec4 initialized with the given values
 *
 * @param {Number} x X component
 * @param {Number} y Y component
 * @param {Number} z Z component
 * @param {Number} w W component
 * @returns {vec4} a new 4D vector
 */


/**
 * Copy the values from one vec4 to another
 *
 * @param {vec4} out the receiving vector
 * @param {vec4} a the source vector
 * @returns {vec4} out
 */


/**
 * Set the components of a vec4 to the given values
 *
 * @param {vec4} out the receiving vector
 * @param {Number} x X component
 * @param {Number} y Y component
 * @param {Number} z Z component
 * @param {Number} w W component
 * @returns {vec4} out
 */


/**
 * Adds two vec4's
 *
 * @param {vec4} out the receiving vector
 * @param {vec4} a the first operand
 * @param {vec4} b the second operand
 * @returns {vec4} out
 */


/**
 * Subtracts vector b from vector a
 *
 * @param {vec4} out the receiving vector
 * @param {vec4} a the first operand
 * @param {vec4} b the second operand
 * @returns {vec4} out
 */


/**
 * Multiplies two vec4's
 *
 * @param {vec4} out the receiving vector
 * @param {vec4} a the first operand
 * @param {vec4} b the second operand
 * @returns {vec4} out
 */


/**
 * Divides two vec4's
 *
 * @param {vec4} out the receiving vector
 * @param {vec4} a the first operand
 * @param {vec4} b the second operand
 * @returns {vec4} out
 */


/**
 * Math.ceil the components of a vec4
 *
 * @param {vec4} out the receiving vector
 * @param {vec4} a vector to ceil
 * @returns {vec4} out
 */


/**
 * Math.floor the components of a vec4
 *
 * @param {vec4} out the receiving vector
 * @param {vec4} a vector to floor
 * @returns {vec4} out
 */


/**
 * Returns the minimum of two vec4's
 *
 * @param {vec4} out the receiving vector
 * @param {vec4} a the first operand
 * @param {vec4} b the second operand
 * @returns {vec4} out
 */


/**
 * Returns the maximum of two vec4's
 *
 * @param {vec4} out the receiving vector
 * @param {vec4} a the first operand
 * @param {vec4} b the second operand
 * @returns {vec4} out
 */


/**
 * Math.round the components of a vec4
 *
 * @param {vec4} out the receiving vector
 * @param {vec4} a vector to round
 * @returns {vec4} out
 */


/**
 * Scales a vec4 by a scalar number
 *
 * @param {vec4} out the receiving vector
 * @param {vec4} a the vector to scale
 * @param {Number} b amount to scale the vector by
 * @returns {vec4} out
 */


/**
 * Adds two vec4's after scaling the second operand by a scalar value
 *
 * @param {vec4} out the receiving vector
 * @param {vec4} a the first operand
 * @param {vec4} b the second operand
 * @param {Number} scale the amount to scale b by before adding
 * @returns {vec4} out
 */


/**
 * Calculates the euclidian distance between two vec4's
 *
 * @param {vec4} a the first operand
 * @param {vec4} b the second operand
 * @returns {Number} distance between a and b
 */


/**
 * Calculates the squared euclidian distance between two vec4's
 *
 * @param {vec4} a the first operand
 * @param {vec4} b the second operand
 * @returns {Number} squared distance between a and b
 */


/**
 * Calculates the length of a vec4
 *
 * @param {vec4} a vector to calculate length of
 * @returns {Number} length of a
 */


/**
 * Calculates the squared length of a vec4
 *
 * @param {vec4} a vector to calculate squared length of
 * @returns {Number} squared length of a
 */


/**
 * Negates the components of a vec4
 *
 * @param {vec4} out the receiving vector
 * @param {vec4} a vector to negate
 * @returns {vec4} out
 */


/**
 * Returns the inverse of the components of a vec4
 *
 * @param {vec4} out the receiving vector
 * @param {vec4} a vector to invert
 * @returns {vec4} out
 */


/**
 * Normalize a vec4
 *
 * @param {vec4} out the receiving vector
 * @param {vec4} a vector to normalize
 * @returns {vec4} out
 */
function normalize$2(out, a) {
  let x = a[0];
  let y = a[1];
  let z = a[2];
  let w = a[3];
  let len = x*x + y*y + z*z + w*w;
  if (len > 0) {
    len = 1 / Math.sqrt(len);
    out[0] = x * len;
    out[1] = y * len;
    out[2] = z * len;
    out[3] = w * len;
  }
  return out;
}

/**
 * Calculates the dot product of two vec4's
 *
 * @param {vec4} a the first operand
 * @param {vec4} b the second operand
 * @returns {Number} dot product of a and b
 */


/**
 * Performs a linear interpolation between two vec4's
 *
 * @param {vec4} out the receiving vector
 * @param {vec4} a the first operand
 * @param {vec4} b the second operand
 * @param {Number} t interpolation amount, in the range [0-1], between the two inputs
 * @returns {vec4} out
 */


/**
 * Generates a random vector with the given scale
 *
 * @param {vec4} out the receiving vector
 * @param {Number} [scale] Length of the resulting vector. If ommitted, a unit vector will be returned
 * @returns {vec4} out
 */


/**
 * Transforms the vec4 with a mat4.
 *
 * @param {vec4} out the receiving vector
 * @param {vec4} a the vector to transform
 * @param {mat4} m matrix to transform with
 * @returns {vec4} out
 */


/**
 * Transforms the vec4 with a quat
 *
 * @param {vec4} out the receiving vector
 * @param {vec4} a the vector to transform
 * @param {quat} q quaternion to transform with
 * @returns {vec4} out
 */


/**
 * Returns a string representation of a vector
 *
 * @param {vec4} a vector to represent as a string
 * @returns {String} string representation of the vector
 */


/**
 * Returns whether or not the vectors have exactly the same elements in the same position (when compared with ===)
 *
 * @param {vec4} a The first vector.
 * @param {vec4} b The second vector.
 * @returns {Boolean} True if the vectors are equal, false otherwise.
 */


/**
 * Returns whether or not the vectors have approximately the same elements in the same position.
 *
 * @param {vec4} a The first vector.
 * @param {vec4} b The second vector.
 * @returns {Boolean} True if the vectors are equal, false otherwise.
 */


/**
 * Alias for {@link vec4.subtract}
 * @function
 */


/**
 * Alias for {@link vec4.multiply}
 * @function
 */


/**
 * Alias for {@link vec4.divide}
 * @function
 */


/**
 * Alias for {@link vec4.distance}
 * @function
 */


/**
 * Alias for {@link vec4.squaredDistance}
 * @function
 */


/**
 * Alias for {@link vec4.length}
 * @function
 */


/**
 * Alias for {@link vec4.squaredLength}
 * @function
 */


/**
 * Perform some operation over an array of vec4s.
 *
 * @param {Array} a the array of vectors to iterate over
 * @param {Number} stride Number of elements between the start of each vec4. If 0 assumes tightly packed
 * @param {Number} offset Number of elements to skip at the beginning of the array
 * @param {Number} count Number of vec4s to iterate over. If 0 iterates over entire array
 * @param {Function} fn Function to call for each vector in the array
 * @param {Object} [arg] additional argument to pass to fn
 * @returns {Array} a
 * @function
 */
const forEach$1 = (function() {
  let vec = create$4();

  return function(a, stride, offset, count, fn, arg) {
    let i, l;
    if(!stride) {
      stride = 4;
    }

    if(!offset) {
      offset = 0;
    }

    if(count) {
      l = Math.min((count * stride) + offset, a.length);
    } else {
      l = a.length;
    }

    for(i = offset; i < l; i += stride) {
      vec[0] = a[i]; vec[1] = a[i+1]; vec[2] = a[i+2]; vec[3] = a[i+3];
      fn(vec, vec, arg);
      a[i] = vec[0]; a[i+1] = vec[1]; a[i+2] = vec[2]; a[i+3] = vec[3];
    }

    return a;
  };
})();

/**
 * Quaternion
 * @module quat
 */

/**
 * Creates a new identity quat
 *
 * @returns {quat} a new quaternion
 */
function create$2() {
  let out = new ARRAY_TYPE(4);
  if(ARRAY_TYPE != Float32Array) {
    out[0] = 0;
    out[1] = 0;
    out[2] = 0;
  }
  out[3] = 1;
  return out;
}

/**
 * Set a quat to the identity quaternion
 *
 * @param {quat} out the receiving quaternion
 * @returns {quat} out
 */


/**
 * Sets a quat from the given angle and rotation axis,
 * then returns it.
 *
 * @param {quat} out the receiving quaternion
 * @param {vec3} axis the axis around which to rotate
 * @param {Number} rad the angle in radians
 * @returns {quat} out
 **/
function setAxisAngle(out, axis, rad) {
  rad = rad * 0.5;
  let s = Math.sin(rad);
  out[0] = s * axis[0];
  out[1] = s * axis[1];
  out[2] = s * axis[2];
  out[3] = Math.cos(rad);
  return out;
}

/**
 * Gets the rotation axis and angle for a given
 *  quaternion. If a quaternion is created with
 *  setAxisAngle, this method will return the same
 *  values as providied in the original parameter list
 *  OR functionally equivalent values.
 * Example: The quaternion formed by axis [0, 0, 1] and
 *  angle -90 is the same as the quaternion formed by
 *  [0, 0, 1] and 270. This method favors the latter.
 * @param  {vec3} out_axis  Vector receiving the axis of rotation
 * @param  {quat} q     Quaternion to be decomposed
 * @return {Number}     Angle, in radians, of the rotation
 */


/**
 * Multiplies two quat's
 *
 * @param {quat} out the receiving quaternion
 * @param {quat} a the first operand
 * @param {quat} b the second operand
 * @returns {quat} out
 */
function multiply$2(out, a, b) {
  let ax = a[0], ay = a[1], az = a[2], aw = a[3];
  let bx = b[0], by = b[1], bz = b[2], bw = b[3];

  out[0] = ax * bw + aw * bx + ay * bz - az * by;
  out[1] = ay * bw + aw * by + az * bx - ax * bz;
  out[2] = az * bw + aw * bz + ax * by - ay * bx;
  out[3] = aw * bw - ax * bx - ay * by - az * bz;
  return out;
}

/**
 * Rotates a quaternion by the given angle about the X axis
 *
 * @param {quat} out quat receiving operation result
 * @param {quat} a quat to rotate
 * @param {number} rad angle (in radians) to rotate
 * @returns {quat} out
 */


/**
 * Rotates a quaternion by the given angle about the Y axis
 *
 * @param {quat} out quat receiving operation result
 * @param {quat} a quat to rotate
 * @param {number} rad angle (in radians) to rotate
 * @returns {quat} out
 */


/**
 * Rotates a quaternion by the given angle about the Z axis
 *
 * @param {quat} out quat receiving operation result
 * @param {quat} a quat to rotate
 * @param {number} rad angle (in radians) to rotate
 * @returns {quat} out
 */


/**
 * Calculates the W component of a quat from the X, Y, and Z components.
 * Assumes that quaternion is 1 unit in length.
 * Any existing W component will be ignored.
 *
 * @param {quat} out the receiving quaternion
 * @param {quat} a quat to calculate W component of
 * @returns {quat} out
 */


/**
 * Performs a spherical linear interpolation between two quat
 *
 * @param {quat} out the receiving quaternion
 * @param {quat} a the first operand
 * @param {quat} b the second operand
 * @param {Number} t interpolation amount, in the range [0-1], between the two inputs
 * @returns {quat} out
 */
function slerp(out, a, b, t) {
  // benchmarks:
  //    http://jsperf.com/quaternion-slerp-implementations
  let ax = a[0], ay = a[1], az = a[2], aw = a[3];
  let bx = b[0], by = b[1], bz = b[2], bw = b[3];

  let omega, cosom, sinom, scale0, scale1;

  // calc cosine
  cosom = ax * bx + ay * by + az * bz + aw * bw;
  // adjust signs (if necessary)
  if ( cosom < 0.0 ) {
    cosom = -cosom;
    bx = - bx;
    by = - by;
    bz = - bz;
    bw = - bw;
  }
  // calculate coefficients
  if ( (1.0 - cosom) > EPSILON ) {
    // standard case (slerp)
    omega  = Math.acos(cosom);
    sinom  = Math.sin(omega);
    scale0 = Math.sin((1.0 - t) * omega) / sinom;
    scale1 = Math.sin(t * omega) / sinom;
  } else {
    // "from" and "to" quaternions are very close
    //  ... so we can do a linear interpolation
    scale0 = 1.0 - t;
    scale1 = t;
  }
  // calculate final values
  out[0] = scale0 * ax + scale1 * bx;
  out[1] = scale0 * ay + scale1 * by;
  out[2] = scale0 * az + scale1 * bz;
  out[3] = scale0 * aw + scale1 * bw;

  return out;
}

/**
 * Generates a random quaternion
 *
 * @param {quat} out the receiving quaternion
 * @returns {quat} out
 */


/**
 * Calculates the inverse of a quat
 *
 * @param {quat} out the receiving quaternion
 * @param {quat} a quat to calculate inverse of
 * @returns {quat} out
 */


/**
 * Calculates the conjugate of a quat
 * If the quaternion is normalized, this function is faster than quat.inverse and produces the same result.
 *
 * @param {quat} out the receiving quaternion
 * @param {quat} a quat to calculate conjugate of
 * @returns {quat} out
 */


/**
 * Creates a quaternion from the given 3x3 rotation matrix.
 *
 * NOTE: The resultant quaternion is not normalized, so you should be sure
 * to renormalize the quaternion yourself where necessary.
 *
 * @param {quat} out the receiving quaternion
 * @param {mat3} m rotation matrix
 * @returns {quat} out
 * @function
 */
function fromMat3(out, m) {
  // Algorithm in Ken Shoemake's article in 1987 SIGGRAPH course notes
  // article "Quaternion Calculus and Fast Animation".
  let fTrace = m[0] + m[4] + m[8];
  let fRoot;

  if ( fTrace > 0.0 ) {
    // |w| > 1/2, may as well choose w > 1/2
    fRoot = Math.sqrt(fTrace + 1.0);  // 2w
    out[3] = 0.5 * fRoot;
    fRoot = 0.5/fRoot;  // 1/(4w)
    out[0] = (m[5]-m[7])*fRoot;
    out[1] = (m[6]-m[2])*fRoot;
    out[2] = (m[1]-m[3])*fRoot;
  } else {
    // |w| <= 1/2
    let i = 0;
    if ( m[4] > m[0] )
      i = 1;
    if ( m[8] > m[i*3+i] )
      i = 2;
    let j = (i+1)%3;
    let k = (i+2)%3;

    fRoot = Math.sqrt(m[i*3+i]-m[j*3+j]-m[k*3+k] + 1.0);
    out[i] = 0.5 * fRoot;
    fRoot = 0.5 / fRoot;
    out[3] = (m[j*3+k] - m[k*3+j]) * fRoot;
    out[j] = (m[j*3+i] + m[i*3+j]) * fRoot;
    out[k] = (m[k*3+i] + m[i*3+k]) * fRoot;
  }

  return out;
}

/**
 * Creates a quaternion from the given euler angle x, y, z.
 *
 * @param {quat} out the receiving quaternion
 * @param {x} Angle to rotate around X axis in degrees.
 * @param {y} Angle to rotate around Y axis in degrees.
 * @param {z} Angle to rotate around Z axis in degrees.
 * @returns {quat} out
 * @function
 */


/**
 * Returns a string representation of a quatenion
 *
 * @param {quat} a vector to represent as a string
 * @returns {String} string representation of the vector
 */


/**
 * Creates a new quat initialized with values from an existing quaternion
 *
 * @param {quat} a quaternion to clone
 * @returns {quat} a new quaternion
 * @function
 */


/**
 * Creates a new quat initialized with the given values
 *
 * @param {Number} x X component
 * @param {Number} y Y component
 * @param {Number} z Z component
 * @param {Number} w W component
 * @returns {quat} a new quaternion
 * @function
 */


/**
 * Copy the values from one quat to another
 *
 * @param {quat} out the receiving quaternion
 * @param {quat} a the source quaternion
 * @returns {quat} out
 * @function
 */


/**
 * Set the components of a quat to the given values
 *
 * @param {quat} out the receiving quaternion
 * @param {Number} x X component
 * @param {Number} y Y component
 * @param {Number} z Z component
 * @param {Number} w W component
 * @returns {quat} out
 * @function
 */


/**
 * Adds two quat's
 *
 * @param {quat} out the receiving quaternion
 * @param {quat} a the first operand
 * @param {quat} b the second operand
 * @returns {quat} out
 * @function
 */


/**
 * Alias for {@link quat.multiply}
 * @function
 */


/**
 * Scales a quat by a scalar number
 *
 * @param {quat} out the receiving vector
 * @param {quat} a the vector to scale
 * @param {Number} b amount to scale the vector by
 * @returns {quat} out
 * @function
 */


/**
 * Calculates the dot product of two quat's
 *
 * @param {quat} a the first operand
 * @param {quat} b the second operand
 * @returns {Number} dot product of a and b
 * @function
 */


/**
 * Performs a linear interpolation between two quat's
 *
 * @param {quat} out the receiving quaternion
 * @param {quat} a the first operand
 * @param {quat} b the second operand
 * @param {Number} t interpolation amount, in the range [0-1], between the two inputs
 * @returns {quat} out
 * @function
 */


/**
 * Calculates the length of a quat
 *
 * @param {quat} a vector to calculate length of
 * @returns {Number} length of a
 */


/**
 * Alias for {@link quat.length}
 * @function
 */


/**
 * Calculates the squared length of a quat
 *
 * @param {quat} a vector to calculate squared length of
 * @returns {Number} squared length of a
 * @function
 */


/**
 * Alias for {@link quat.squaredLength}
 * @function
 */


/**
 * Normalize a quat
 *
 * @param {quat} out the receiving quaternion
 * @param {quat} a quaternion to normalize
 * @returns {quat} out
 * @function
 */
const normalize$1 = normalize$2;

/**
 * Returns whether or not the quaternions have exactly the same elements in the same position (when compared with ===)
 *
 * @param {quat} a The first quaternion.
 * @param {quat} b The second quaternion.
 * @returns {Boolean} True if the vectors are equal, false otherwise.
 */


/**
 * Returns whether or not the quaternions have approximately the same elements in the same position.
 *
 * @param {quat} a The first vector.
 * @param {quat} b The second vector.
 * @returns {Boolean} True if the vectors are equal, false otherwise.
 */


/**
 * Sets a quaternion to represent the shortest rotation from one
 * vector to another.
 *
 * Both vectors are assumed to be unit length.
 *
 * @param {quat} out the receiving quaternion.
 * @param {vec3} a the initial vector
 * @param {vec3} b the destination vector
 * @returns {quat} out
 */
const rotationTo = (function() {
  let tmpvec3 = create();
  let xUnitVec3 = fromValues(1,0,0);
  let yUnitVec3 = fromValues(0,1,0);

  return function(out, a, b) {
    let dot$$1 = dot(a, b);
    if (dot$$1 < -0.999999) {
      cross(tmpvec3, xUnitVec3, a);
      if (len(tmpvec3) < 0.000001)
        cross(tmpvec3, yUnitVec3, a);
      normalize(tmpvec3, tmpvec3);
      setAxisAngle(out, tmpvec3, Math.PI);
      return out;
    } else if (dot$$1 > 0.999999) {
      out[0] = 0;
      out[1] = 0;
      out[2] = 0;
      out[3] = 1;
      return out;
    } else {
      cross(tmpvec3, a, b);
      out[0] = tmpvec3[0];
      out[1] = tmpvec3[1];
      out[2] = tmpvec3[2];
      out[3] = 1 + dot$$1;
      return normalize$1(out, out);
    }
  };
})();

/**
 * Performs a spherical linear interpolation with two control points
 *
 * @param {quat} out the receiving quaternion
 * @param {quat} a the first operand
 * @param {quat} b the second operand
 * @param {quat} c the third operand
 * @param {quat} d the fourth operand
 * @param {Number} t interpolation amount, in the range [0-1], between the two inputs
 * @returns {quat} out
 */
const sqlerp = (function () {
  let temp1 = create$2();
  let temp2 = create$2();

  return function (out, a, b, c, d, t) {
    slerp(temp1, a, d, t);
    slerp(temp2, b, c, t);
    slerp(out, temp1, temp2, 2 * t * (1 - t));

    return out;
  };
}());

/**
 * Sets the specified quaternion with values corresponding to the given
 * axes. Each axis is a vec3 and is expected to be unit length and
 * perpendicular to all other specified axes.
 *
 * @param {vec3} view  the vector representing the viewing direction
 * @param {vec3} right the vector representing the local "right" direction
 * @param {vec3} up    the vector representing the local "up" direction
 * @returns {quat} out
 */
const setAxes = (function() {
  let matr = create$3();

  return function(out, view, right, up) {
    matr[0] = right[0];
    matr[3] = right[1];
    matr[6] = right[2];

    matr[1] = up[0];
    matr[4] = up[1];
    matr[7] = up[2];

    matr[2] = -view[0];
    matr[5] = -view[1];
    matr[8] = -view[2];

    return normalize$1(out, fromMat3(out, matr));
  };
})();

// XXX gl-matrix has a bug in quat.setAxes:
// https://github.com/toji/gl-matrix/issues/234
// The following implementation changes the order of axes to match our
// interpretation.
function set_axes(out, left, up, forward) {
  let matrix = Float32Array.of(...left, ...up, ...forward);
  return normalize$1(out, fromMat3(out, matrix));
}

function to_radian(a) {
  return a * Math.PI / 180;
}

let canvas = document.createElement('canvas');
let gl = canvas.getContext('webgl2');

function create_float_buffer(data) {
  let buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.STATIC_DRAW);

  return buffer;
}

function create_index_buffer(data) {
  let buffer = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(data), gl.STATIC_DRAW);
  return buffer;
}

function create_shader_object(shader_type, source) {
  let shader = gl.createShader(shader_type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    throw gl.getShaderInfoLog(shader);
  }

  return shader;
}

function create_program_object(vs, fs) {
  let program = gl.createProgram();
  gl.attachShader(program, vs);
  gl.attachShader(program, fs);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    throw gl.getProgramInfoLog(program);
  }

  return program;
}

let default_options$1 = {
  components: [],
  skip: false,
};

class Entity extends Map {
  constructor(options = {}) {
    super();
    Object.assign(this, default_options$1, options);

    this.entities = new Set();

    for (let component of options.components) {
      this.attach(component);
    }
  }

  attach(instance) {
    instance.entity = this;
    instance.mount();

    let component = instance.constructor;
    this.set(component, instance);

    if (this.game) {
      if (!this.game.all.has(component)) {
        this.game.all.set(component, new Set());
      }
      this.game.all.get(component).add(instance);
    }
  }

  detach(component) {
    let instance = this.get(component);
    this.delete(component);

    if (this.game && this.game.all.has(component)) {
      this.game.all.get(component).delete(instance);
    }
  }

  *iterall(component) {
    for (let child of this.entities) {
      if (child.has(component)) {
        yield child.get(component);
      }
      yield * child.iterall(component);
    }
  }

  add(entity) {
    entity.parent = this;
    this.entities.add(entity);

    if (this.game) {
      // Track the child if the current entity already exists in the scene.
      this.game.track_entity(entity);
    }
  }

  update(tick_delta) {
    if (this.skip) {
      return;
    }

    let update_each = updatable => updatable.update(tick_delta);
    this.forEach(update_each);
    this.entities.forEach(update_each);
  }

  render(tick_delta) {
    if (this.skip) {
      return;
    }

    let render_each = renderable => renderable.render(tick_delta);
    this.forEach(render_each);
    this.entities.forEach(render_each);
  }
}

let default_options$3 = {
  entity: null
};

class Component$1 {
  constructor(options) {
    Object.assign(this,  default_options$3, options);
  }

  static get features() {
    return [];
  }
  /*
   * Called in Entity.attach.
   *
   * Use this to intialize the component instance. this.entity is available
   * here.
   */
  mount() {
  }

  set(values) {
    Object.assign(this, values);
  }

  /*
   * Called on each tick.
   */
  update() {
  }

  /*
   * Called on each animation frame.
   */
  render() {
  }
}

let default_options$2 = {
  _scale: unit.slice(),
  _rotation: create$2(),

  scale: unit.slice(),
  position: zero.slice(),
  rotation: create$2()
};

class Transform extends Component$1 {
  constructor(options) {
    super(Object.assign({
      matrix: create$1(),
      world: create$1(),
    },  default_options$2, options));
  }

  get self() {
    return invert(this.world);
  }

  get left() {
    let out = of(this.matrix.m11, this.matrix.m12, this.matrix.m13);
    return normalize(out, out);
  }

  get up() {
    let out = of(this.matrix.m21, this.matrix.m22, this.matrix.m23);
    return normalize(out, out);
  }

  get forward() {
    let out = of(this.matrix.m31, this.matrix.m32, this.matrix.m33);
    return normalize(out, out);
  }

  set position(vec) {
    compose(this.matrix, this.rotation, vec, this.scale);
  }

  get position() {
    return of(this.matrix.m41, this.matrix.m42, this.matrix.m43);
  }

  set scale(vec) {
    this._scale = vec;
    compose(this.matrix, this.rotation, this.position, vec);
  }

  get scale() {
    return this._scale;
  }

  set rotation(quaternion) {
    this._rotation = quaternion;
    compose(this.matrix, quaternion, this.position, this.scale);
  }

  get rotation() {
    return this._rotation;
  }

  look_at(target_position) {
    // Find the direction we're looking at. target_position must be given in
    // the current entity's coordinate space.  Use target's world and
    // the current entity's self to go from target's space to the
    // current entity space.
    let forward$$1 = zero.slice();
    subtract(forward$$1, target_position, this.position);
    normalize(forward$$1, forward$$1);

    // Assume that the world's horizontal plane is the frame of reference for
    // the look_at rotations. This should be fine for most game cameras which
    // don't need to roll.

    // Find left by projecting forward onto the world's horizontal plane and
    // rotating it 90 degress counter-clockwise. For any (x, y, z), the rotated
    // vector is (z, y, -x).
    let left$$1 = of(forward$$1[2], 0, -forward$$1[0]);
    normalize(left$$1, left$$1);

    // Find up by computing the cross-product of forward and left according to
    // the right-hand rule.
    let up$$1 = zero.slice();
    cross(up$$1, forward$$1, left$$1);

    // Create a quaternion out of the three axes. The vectors represent axes:
    // they are perpenticular and normalized.
    let rotation = create$2();
    set_axes(rotation, left$$1, up$$1, forward$$1);

    this.rotation = rotation;
  }

  rotate_along(vec, rad) {
    let rotation = create$2();
    setAxisAngle(rotation, vec, rad);

    // Quaternion multiplication: A * B applies the A rotation first, B second,
    // relative to the coordinate system resulting from A.
    multiply$2(rotation, this.rotation, rotation);
    this.rotation = rotation;
  }

  // XXX Add a relative_to attribute for interpreting the translation in spaces
  // other than the local space (relative to the parent).
  translate(vec) {
    let movement = zero.slice();
    add(movement, this.position, vec);
    this.position = movement;
  }

  get_view_matrix(out) {
    let look_at_vect = [];
    add(look_at_vect, this.position, this.forward);
    look_at(out, this.position, look_at_vect, this.up);
    return out;
  }

  update() {
    if (this.entity.parent) {
      this.world = multiply$1(
        this.entity.parent.get(Transform).world,
        this.matrix
      );
    } else {
      // We never modify the elements of the world matrix so it's OK to point it
      // to the local matrix for perf improvements.
      this.world = this.matrix;
    }
  }
}

let default_options$4 = {
  material: null,
  vertices: [],
  indices: [],
  normals: [],
  uvs: [],
  color: 'fff',
  opacity: 1
};

class Render extends Component$1 {
  constructor(options) {
    super(options);
    Object.assign(this,  default_options$4, options);

    this.create_buffers();
  }

  set color(hex) {
    this._color = hex || 'fff';
    this.color_vec = [...hex_to_rgb(this._color), this.opacity];
  }

  get color() {
    return this._color;
  }

  create_buffers() {
    this.buffers = {
      vertices: create_float_buffer(this.vertices),
      indices: create_index_buffer(this.indices),
      qty: this.indices.length,
      normals: create_float_buffer(this.normals),
      uvs: create_float_buffer(this.uvs)
    };
  }

  render() {
    this.material.render(this.entity);
  }
}

// When using arrow keys for rotation simulate the mouse delta of this value.
let KEY_ROTATION_DELTA = 3;

let default_options$5 = {
  keyboard_controlled: false,
  mouse_controlled: false,

  move_speed: 3.5,
  rotate_speed: .5,

  dir_desc: {
    87: 'f',
    65: 'l',
    68: 'r',
    83: 'b',
    69: 'u',
    81: 'd',
    38: 'pu',
    40: 'pd',
    39: 'yr',
    37: 'yl'
  }
};

class Move extends Component$1 {
  constructor(options) {
    super(options);
    Object.assign(this,  default_options$5, options);
  }

  handle_keys(tick_length, {f = 0, b = 0, l = 0, r = 0, u = 0, d = 0, pu = 0, pd = 0, yl = 0, yr = 0}) {
    let entity_transform = this.entity.get(Transform);
    let dist = tick_length / 1000 * this.move_speed;

    // The desired XZ direction vector in self space. This is what the user
    // wanted to do: walk forward/backward and left/right.
    let direction = of(l - r, 0, f - b);

    // Transform the input from self to local space.  If the user wanted to go
    // "left" in the entity's self space what does it mean in the local space?
    transform_mat4(direction, direction, entity_transform.matrix);
    // Direction is now a point in the entity's local space. Subtract the
    // position to go back to a movement vector.
    subtract(direction, direction, entity_transform.position);

    // Up and down movement always happens relative to the local space
    // regardless of the current pitch of the entity.  This can be understood
    // as projecting the direction vector to the XZ plane first (Y = 0) and
    // then adding the Y input.
    direction[1] = (u - d);

    // Scale direction by this tick's distance.
    normalize(direction, direction);
    scale(direction, direction, dist);

    entity_transform.translate(direction);

    // Simulate mouse deltas for rotation.
    let mouse_delta = {
      x: yl * KEY_ROTATION_DELTA - yr * KEY_ROTATION_DELTA,
      y: pu * KEY_ROTATION_DELTA - pd * KEY_ROTATION_DELTA,
    };

    this.handle_mouse(tick_length, mouse_delta);
  }

  handle_mouse(tick_length, {x, y}) {
    let entity_transform = this.entity.get(Transform);
    // Check if there's any input to handle.
    if (x === 0 && y === 0) {
      return;
    }

    let time_delta = tick_length / 1000;
    let azimuth = this.rotate_speed * time_delta * x;
    let polar = this.rotate_speed * time_delta * y;

    // Polar (with the zenith being the Y axis) to Cartesian, but polar is
    // counted from Z to Y rather than from Y to Z, so we swap cos(polar) for
    // sin(polar) and vice versa.
    let forward$$1 = of(
      Math.cos(polar) * Math.sin(azimuth),
      Math.sin(polar),
      Math.cos(polar) * Math.cos(azimuth)
    );
    normalize(forward$$1, forward$$1);
    // Transform forward to the object's local coordinate space (relative to
    // the parent).
    transform_mat4(forward$$1, forward$$1, entity_transform.matrix);
    entity_transform.look_at(forward$$1);
  }

  update(tick_length) {
    if (this.keyboard_controlled && this.entity.game) {
      let current_dirs = {};

      for (let [key_code, dir] of Object.entries(this.dir_desc)) {
        current_dirs[dir] = this.entity.game.get_key(key_code);
      }

      this.handle_keys(tick_length, current_dirs);
    }

    if (this.mouse_controlled && this.entity.game) {
      this.handle_mouse(tick_length, this.entity.game.mouse_delta);
    }
  }
}

let default_options$7 = {
  intensity: 0.5,
  color: '#ffffff'
};

class Light extends Component$1 {
  constructor(options) {
    super(Object.assign(default_options$7, options));
  }

  set color(hex) {
    this._color = hex || 'fff';
    this.color_vec = [...hex_to_rgb(this._color)];
  }

  get color() {
    return this._color;
  }
}

// export * from './rigid_body';

let default_options = {
  canvas,
  width: 800,
  height: 600,
  dom: document.body,
  fps: 60,
  running: true,
  fov: 60,
  near: 0.35,
  far: 85,
  left: -10,
  right: 10,
  bottom: -10,
  top: 10,
  clear_color: '#FFFFFF',
  clear_opacity: 1,
  projection: 'perspective'
};

let EVENTS = ["keydown", "keyup", "mousemove"];

class Game {
  constructor(options) {
    Object.assign(this, default_options, options);

    this.canvas.width = this.width;
    this.canvas.height = this.height;
    this.dom.appendChild(canvas);

    this.reset();

    this.camera = new Entity({
      components: [
        new Transform(),
        new Move()
      ]
    });

    this.camera.game = this;

    this.light = new Entity({
      components: [
        new Transform(),
        new Light()
      ]
    });
    this.add(this.light);


    this.projMatrix = create$1();
    this.viewMatrix = create$1();

    if (this.projection === 'ortho') {
      this.setup_ortho_camera();
    } else {
      this.setup_perspective_camera();
    }

    this.tick_delta = 1000 / this.fps;

    for (let event_name of EVENTS) {
      let handler_name = "on" + event_name;
      this[handler_name] = this[handler_name].bind(this);
      window.addEventListener(event_name, this[handler_name]);
    }

    if (this.running) {
      this.start();
    }

    gl.enable(gl.CULL_FACE);
    gl.enable(gl.DEPTH_TEST);

    gl.clear(gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT);
  }

  setup_ortho_camera() {
    ortho(
      this.projMatrix,
      this.left,
      this.right,
      this.bottom,
      this.top,
      this.near,
      this.far
    );
  }

  setup_perspective_camera() {
    perspective(
      this.projMatrix,
      to_radian(this.fov),
      this.width / this.height,
      this.near,
      this.far
    );
  }

  get clear_color() {
    return this._clear_color;
  }

  set clear_color(hex) {
    this._clear_color = hex;
    let color_vec = hex_to_rgb(hex);

    gl.clearColor(
      color_vec[0],
      color_vec[1],
      color_vec[2],
      this.clear_opacity
    );
  }

  set clear_opacity(value) {
    this._clear_opacity = value;
    let color_vec = hex_to_rgb(this._clear_color);

    gl.clearColor(
      color_vec[0],
      color_vec[1],
      color_vec[2],
      this._clear_opacity
    );
  }

  get clear_opacity() {
    return this._clear_opacity;
  }

  stop() {
    this.running = false;
  }

  start() {
    this.running = true;
    this.last_tick = performance.now();
    window.requestAnimationFrame(frame_time => this.frame(frame_time));
  }

  reset() {
    this.entities = new Set();
    this.listeners = new Map();
    this.keys = {};
    this.mouse_delta = {x: 0, y: 0};
    this.all = new WeakMap();
  }

  destroy() {
    for (let event_name of EVENTS) {
      window.removeEventListener(event_name, this[event_name]);
    }
  }

  emit(event_name, ...args) {
    if (this.listeners.has(event_name)) {
      for (let handler of this.listeners.get(event_name)) {
        handler(...args);
      }
    }
  }

  on(event_name, handler) {
    if (!this.listeners.has(event_name)) {
      this.listeners.set(event_name, new Set());
    }

    this.listeners.get(event_name).add(handler);
    return handler;
  }

  off(event_name, handler) {
    if (this.listeners.has(event_name)) {
      this.listeners.get(event_name).delete(handler);
    }
  }

  onkeydown(e) {
    this.keys[e.keyCode] = 1;
  }

  onkeyup(e) {
    this.keys[e.keyCode] = 0;
  }

  get_key(key_code) {
    // Make sure we return 0 for undefined, i.e. keys we haven't seen
    // pressed at all.
    return this.keys[key_code] || 0;
  }

  onmousemove(e) {
    // Accumulate the deltas for each mousemove event that that fired between
    // any two ticks. Our +X is left, +Y is up while the browser's +X is to the
    // right, +Y is down. Inverse the values by subtracting rather than adding.
    this.mouse_delta.x -= e.movementX;
    this.mouse_delta.y -= e.movementY;
  }

  frame(frame_time) {
    if (this.running) {
      window.requestAnimationFrame(frame_time => this.frame(frame_time));
    }

    if (frame_time > this.last_tick + this.tick_delta) {
      let accumulated_delta = frame_time - this.last_tick;
      let ticks_qty = Math.floor(accumulated_delta / this.tick_delta);
      this.perform_ticks(ticks_qty);
      this.render();
    }
  }

  perform_ticks(ticks_qty) {
    // Mouse delta is measured since the last time this.tick was run.  If there
    // is more than one tick to perform we need to scale the delta down to
    // maintain consistent movement.
    this.mouse_delta.x /= ticks_qty;
    this.mouse_delta.y /= ticks_qty;

    for (let i = 0; i < ticks_qty; i++) {
      this.last_tick = this.last_tick + this.tick_delta;
      this.update();
    }

    // Reset the mouse delta.
    this.mouse_delta.x = 0;
    this.mouse_delta.y = 0;
  }

  update() {
    this.emit('tick', this.last_tick);
    this.entities.forEach(entity => entity.update(this.tick_delta));
    this.camera.update(this.tick_delta);
    this.camera.get(Transform).get_view_matrix(this.viewMatrix);
  }

  render() {
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.viewport(0, 0, this.canvas.width, this.canvas.height);
    this.entities.forEach(entity => entity.render());
    this.emit('afterrender');
  }

  track_entity(entity) {
    entity.game = this;

    for (let [component, instance] of entity.entries()) {
      if (!this.all.has(component)) {
        this.all.set(component, new Set());
      }
      this.all.get(component).add(instance);
    }

    // Recursively track children.
    for (let child of entity.entities) {
      this.track_entity(child);
    }
  }

  untrack_entity(entity) {
    entity.game = null;

    for (let [component, instance] of entity.entries()) {
      this.all.get(component).delete(instance);
    }

    // Recursively untrack children.
    for (let child of entity.entities) {
      this.untrack_entity(child);
    }
  }

  add(entity) {
    this.entities.add(entity);
    this.track_entity(entity);
  }

  remove(entity) {
    this.entities.delete(entity);
    this.untrack_entity(entity);
  }
}

class Tween {
  constructor(options) {
    this.to = options.to;
    this.time = options.time || 1000;
    this.game = options.game;
    this.object = options.object;
    this.property = options.property;
    this.cb = options.cb;
  }

  do_step(tick) {
    this.current_step = Math.min(
      1,
      ((tick - this.first_tick) / this.tick_delta) * this.step
    );
    this.action();
  }

  action() {}

  pre_start() {
    this.tick_delta = this.game.tick_delta;
    this.first_tick = this.game.last_tick;
    this.number_of_ticks = Math.ceil(this.time / this.tick_delta);
    this.step = 1 / this.number_of_ticks;
  }

  start() {
    this.pre_start();
    return new Promise((resolve) => {
      let bound = (tick) => {
        if (this.current_step === 1) {
          this.game.off('tick', bound);
          resolve();
        } else {
          this.do_step(tick, resolve);
        }
      };
      this.game.on('tick', bound);
    });
  }
}

//
// Variables used by fragment shader
//
// vec4 c; // color
// vec3 fp; // fragment position
// vec3[MAX_LIGHTS] lp; // light position
// vec3[MAX_LIGHTS] lc; // light color
// float[MAX_LIGHTS] li; // light intensity
// int al; // active lights
// vec3 fn; // vertex normals
// vec3 fc; // fog color
// vec2 fd; // fog distance

function fragment(defines) {
  return `#version 300 es

    ${defines.map(def => `
      #define ${def}
    `).join('')}

    precision mediump float;

    uniform vec4 c;

    in vec3 fp;

    #ifdef LIGHTS
      uniform vec3[100] lp;
      uniform vec3[100] lc;
      uniform float[100] li;
      uniform int al;

      in vec3 fn;
    #endif

    #ifdef FOG
      uniform vec3 fc;
      uniform vec2 fd;
      in float fdist;
    #endif

    out vec4 frag_color;

    void main()
    {
      #ifdef FOG
        float ff = clamp((fd.y - fdist) / (fd.y - fd.x), 0.0, 1.0);
      #endif

      #ifdef LIGHTS
        vec4 light = vec4(0.0, 0.0, 0.0, 1.0);
        for (int i = 0; i < al; i++) {
          vec3 ldir = lp[i] - fp;
          vec3 L = normalize(ldir);
          float df = max(dot(fn, L), 0.0);
          vec3 rgb = c.rgb * df * lc[i] * li[i] / length(ldir);
          light += vec4(rgb, c.a);
        }

        #ifdef FOG
          frag_color = mix(vec4(fc, 1.0), light, ff);
        #else
          frag_color = light;
        #endif
      #else
          #ifdef FOG
            frag_color = mix(vec4(fc, 1.0), c, ff);
          #else
            frag_color = c;
          #endif
      #endif
    }
  `;
}

// Variables used by Vertex shader
//
// mat4 p; //projection
// mat4 v; //view
// mat4 w; // world
// vec3 vp; // current frame vertex position
// vec3 vn; // current frame normal
// vec3 fn; // output normal

function vertex(defines) {
  return `#version 300 es

    ${defines.map(def => `
      #define ${def}
    `).join('')}

    precision mediump float;

    uniform mat4 p;
    uniform mat4 v;
    uniform mat4 w;

    in vec3 vp;

    #ifdef LIGHTS
      in vec3 vn;
      out vec3 fn;
    #endif

    #ifdef FOG
      uniform vec3 camera;
      out float fdist;
    #endif

    out vec3 fp;

    void main()
    {

        fp = (w * vec4(vp, 1.0)).xyz;

        #ifdef LIGHTS
          fn = (vec4(vn, 0.0)).xyz;
        #endif

      gl_Position = p * v * vec4(fp, 1.0);

      #ifdef FOG
        fdist = distance(w * vec4(vp, 1.0), vec4(camera, 1.0));
      #endif
    }
  `;
}

class Material {
  constructor(options = {}) {
    this.uniforms = {};
    this.attribs = {};
    this.draw_mode = gl.TRIANGLES;
    this.features = new Set([].concat(
      ...Array.from(options.requires || []).map(comp => comp.features))
    );

    this._textures = {};

    this.texture = options.texture || false;
    this.normal_map = options.normal_map || false;
  }

  add_feature(feature) {
    this.features.add(feature);
  }

  has_feature(feature) {
    return this.features.has(feature);
  }

  remove_feature(feature) {
    this.features.delete(feature);
  }

  add_fog(options = {}) {
    this.add_feature('FOG');
    this.fog = {
      color: options.color || new Float32Array([0, 0, 0]),
      // Distance of fog [where fog starts, where fog completely covers object]
      distance: options.distance || new Float32Array([10, 30])
    };

    this.setup_program();
  }

  setup_program() {
    this.program = create_program_object(
      create_shader_object(
        gl.VERTEX_SHADER,
        vertex(Array.from(this.features))
      ),
      create_shader_object(
        gl.FRAGMENT_SHADER,
        fragment(Array.from(this.features))
      )
    );

    if (this.program.error) {
      console.log(this.program.error); return;
    } else {
      this.get_locations();
    }

  }

  get_uniforms_and_attrs(uniforms, attrs) {
    uniforms.forEach(uniform => {
      this.uniforms[uniform] = gl.getUniformLocation(this.program, uniform);
    });

    attrs.forEach(attr => {
      this.attribs[attr] = gl.getAttribLocation(this.program, attr);
    });
  }

  // apply_shader(entity, game) {
  //
  // }

  set texture(image_promise) {
    this.build_texture(image_promise, this._texture_image, 'TEXTURE', 'gl_texture');
  }

  get texture() {
    return this._texture_image;
  }

  set normal_map(image_promise) {
    this.build_texture(image_promise, this._normal_map_image, 'NORMAL_MAP', 'gl_normal_map');
  }

  get normal_map() {
    return this._normal_map_image;
  }

  build_texture(image_promise, url_location, feature, gl_texture_key) {
    if (image_promise) {
      if (!this._textures[gl_texture_key]) {
        this._textures[gl_texture_key] = gl.createTexture();
      }

      image_promise.then(image => {
        if (url_location !== image) {
          url_location = image;

          gl.bindTexture(gl.TEXTURE_2D, this._textures[gl_texture_key]);
          gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA,gl.UNSIGNED_BYTE, image);
          gl.generateMipmap(gl.TEXTURE_2D);

          if (!this.has_feature(feature)) {
            this.add_feature(feature);
            this.setup_program();
          }
        }
      })
      .catch(console.error);

    } else if (!image_promise) {

      url_location = null;
      this.remove_feature(feature);
      this.setup_program();

    }
  }

  render(entity) {
    let ent = entity;
    let game = ent.game;

    while(ent.parent && !game) {
      ent = ent.parent;
      game = ent.game;
    }

    gl.useProgram(this.program);
    gl.uniformMatrix4fv(this.uniforms.p, gl.FALSE, game.projMatrix.toFloat32Array());
    gl.uniformMatrix4fv(this.uniforms.v, gl.FALSE, game.viewMatrix.toFloat32Array());

    gl.uniformMatrix4fv(
      this.uniforms.w,
      gl.FALSE,
      entity.get(Transform).world.toFloat32Array()
    );

    gl.uniform4fv(
      this.uniforms.c,
      entity.get(Render).color_vec
    );

    this.apply_shader(entity, game);
  }
}

let base_seed = 19870306 * 6647088;

let seed = base_seed;



let rand = function() {
  seed = seed * 16807 % 2147483647;
  return (seed - 1) / 2147483646;
};

function integer(min = 0, max = 1) {
  return Math.floor(rand() * (max - min + 1) + min);
}

function float(min = 0, max = 1) {
  return rand() * (max - min) + min;
}

function element_of(arr) {
  return arr[integer(0, arr.length - 1)];
}

/*
 * Random position inside of a circle.
 */

// import {vec3} from "./cervus/math";

class GridMove extends Move {
    constructor() {
        super();
        delete this.dir_desc[69];
        delete this.dir_desc[81];
        this.tick = 0;
    }
    mount() {
        this.transform = this.entity.get(Transform);
        this.last = this.transform.position;
    }

    is_colliding() {
        let padding = 0.5;
        let { position: [x,, z] } = this.transform;

        for (let building of this.buildings) {
            if (x + padding >= building[0] &&
                x - padding <= building[1] &&
                z + padding >= building[2] &&
                z - padding <= building[3]) {
                return true;
            }
        }

        if (x < 0 || x > this.size[0] || z < 0 || z > this.size[1]) {
            return true;
        }
    }
    update(delta) {
        this.tick++;

        if (this.is_colliding()) {
            this.transform.position = this.last;
        } else {
            if (this.tick % 10 === 0) {
                this.last = this.transform.position;
            }
            super.update(delta);
        }
    }
}

// import create_gizmo from "./gizmo";

class NearbyLight extends Component$1 {
    // mount() {
    //     this.gizmo = create_gizmo();
    // }

    set(values) {
        super.set(values);
        if (this.active) {
            this.entity.get(Light).set(values);
        }
    }

    on() {
        this.active = true;
        let {color, intensity} = this;
        this.entity.attach(new Light({
            color, intensity
        }));
        // this.entity.attach(this.gizmo);
    }

    off() {
        this.active = false;
        this.entity.detach(Light);
        // this.entity.detach(Object.getPrototypeOf(this.gizmo));
    }
}

// 1 vox = this many units/meters
let SCALE = 4;
let CLEAR_COLOR = "333";

let WIREFRAME_COLOR = "888";

let BUILDING_COLOR = "222";
let BUILDING_FOG_MIN = 0;
let BUILDING_FOG_MAX = 40;

let NEON_FOG_MIN = 25;
let NEON_FOG_MAX = 100;
let NEON_LIGHT_MOUNT = 2;
let NEON_INTENSITY = 10;
let NEON_SCALE = 0.8;

let POWERUP_COLOR = "fff";
let POWERUP_INTENSITY = 5;

let LIGHT_DISTANCE = 30;

let HUE_MIN = -.09;
let HUE_MAX = .55;
let SATURATION = .9;
let LUMINANCE = .6;

function world_pos(world_matrix) {
    return of(
        world_matrix.m41,
        world_matrix.m42,
        world_matrix.m43,
    );
}

class EnergySaver extends Component$1 {
    update() {
        let transform = this.entity.get(Transform);

        let lights = this.entity.game.all.get(NearbyLight);
        for (let light of lights) {
            let light_transform = light.entity.get(Transform);
            let dist = distance(
                world_pos(transform.world),
                world_pos(light_transform.world));

            if (dist > LIGHT_DISTANCE && light.active) {
                light.off();
                continue;
            }

            if (dist <= LIGHT_DISTANCE && !light.active) {
                light.on();
            }
        }
    }
}

class Trigger extends Component$1 {
    mount() {
        this.transform = this.entity.get(Transform);
    }

    contains(world_point) {
        // Point in self space.
        let point = zero.slice();
        transform_mat4(
            point, world_point, this.transform.self);
        // XXX How to parametrize each shape?
        return point.map(Math.abs).every(n => n <= this.radius);
    }

    trigger() {
        this.entity.game.remove(this.entity);
        dispatch(...this.action);
    }
}

class Actor extends Component$1 {
    mount() {
        this.transform = this.entity.get(Transform);
    }

    update() {
        let collidables = this.entity.game.all.get(Trigger);
        for (let trigger of collidables) {
            if (trigger.contains(this.transform.position)) {
                trigger.trigger();
            }
        }
    }
}

let vertices = [
  0.5, 0.5, 0.5,
  0.5, 0.5, -0.5,
  0.5, -0.5, 0.5,
  0.5, -0.5, -0.5,
  -0.5, 0.5, -0.5,
  -0.5, 0.5, 0.5,
  -0.5, -0.5, -0.5,
  -0.5, -0.5, 0.5,
  -0.5, 0.5, -0.5,
  0.5, 0.5, -0.5,
  -0.5, 0.5, 0.5,
  0.5, 0.5, 0.5,
  -0.5, -0.5, 0.5,
  0.5, -0.5, 0.5,
  -0.5, -0.5, -0.5,
  0.5, -0.5, -0.5,
  -0.5, 0.5, 0.5,
  0.5, 0.5, 0.5,
  -0.5, -0.5, 0.5,
  0.5, -0.5, 0.5,
  0.5, 0.5, -0.5,
  -0.5, 0.5, -0.5,
  0.5, -0.5, -0.5,
  -0.5, -0.5, -0.5
];

let indices = [
  0, 2, 1,
  2, 3, 1,
  4, 6, 5,
  6, 7, 5,
  8, 10, 9,
  10, 11, 9,
  12, 14, 13,
  14, 15, 13,
  16, 18, 17,
  18, 19, 17,
  20, 22, 21,
  22, 23, 21
];

let normals = [
  1, 0, 0,
  1, 0, 0,
  1, 0, 0,
  1, 0, 0,
  -1, 0, 0,
  -1, 0, 0,
  -1, 0, 0,
  -1, 0, 0,
  0, 1, 0,
  0, 1, 0,
  0, 1, 0,
  0, 1, 0,
  0, -1, 0,
  0, -1, 0,
  0, -1, 0,
  0, -1, 0,
  0, 0, 1,
  0, 0, 1,
  0, 0, 1,
  0, 0, 1,
  0, 0, -1,
  0, 0, -1,
  0, 0, -1,
  0, 0, -1
];

let uvs = [
  0, 0,
  1, 0,
  0, 1,
  1, 1,

  0, 0,
  1, 0,
  0, 1,
  1, 1,

  0, 0,
  1, 0,
  0, 1,
  1, 1,

  0, 0,
  1, 0,
  0, 1,
  1, 1,

  0, 0,
  1, 0,
  0, 1,
  1, 1,

  0, 0,
  1, 0,
  0, 1,
  1, 1,

];

class Box extends Entity {
  constructor(options = {}) {
    options.components = [
      new Transform(),
      new Render({
        vertices,
        indices,
        normals,
        material: options.material,
        uvs
      })
    ];

    super(options);
  }
}

class Rotator extends Component$1 {
    mount() {
        this.transform = this.entity.get(Transform);
    }

    update(delta) {
        let [x, y, z] = this.speed;
        this.transform.rotate_along(left, x * delta);
        this.transform.rotate_along(up, y * delta);
        this.transform.rotate_along(forward, z * delta);
    }
}

class BasicMaterial extends Material {
  constructor(options) {
    super(options);

    this.setup_program();
  }

  get_locations() {
    this.get_uniforms_and_attrs(
      ['p', 'v', 'w', 'c', 'fc', 'fd', 'camera'],
      ['vp']
    );
  }

  apply_shader(entity, game) {
    let render = entity.get(Render);
    let buffers = render.buffers;

    if (render.material.has_feature('FOG')) {
      gl.uniform3fv(this.uniforms.fc, this.fog.color);
      gl.uniform2fv(this.uniforms.fd, this.fog.distance);
      gl.uniform3fv(this.uniforms.camera, game.camera.get(Transform).position);
    }

    // current frame
    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.vertices);
    gl.vertexAttribPointer(
      this.attribs.vp,
      3, gl.FLOAT, gl.FALSE,
      0, 0
    );

    gl.enableVertexAttribArray(this.attribs.vp);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffers.indices);
    gl.drawElements(this.draw_mode, buffers.qty, gl.UNSIGNED_SHORT, 0);
  }
}

class PhongMaterial extends Material {
  constructor(options) {
    super(options);
    this.add_feature('LIGHTS');

    this.setup_program();
  }

  get_locations() {
    this.get_uniforms_and_attrs(
      ['p', 'v', 'w', 'lp', 'li', 'lc', 'al', 'c', 'fc', 'fd', 'camera'],
      ['vp', 'vn']
    );
  }

  apply_shader(entity, game) {
    let render = entity.get(Render);
    let buffers = render.buffers;

    if (render.material.has_feature('FOG')) {
      gl.uniform3fv(this.uniforms.fc, this.fog.color);
      gl.uniform2fv(this.uniforms.fd, this.fog.distance);
      gl.uniform3fv(this.uniforms.camera, game.camera.get(Transform).position);
    }

    // current frame
    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.vertices);
    gl.vertexAttribPointer(
      this.attribs.vp,
      3, gl.FLOAT, gl.FALSE,
      0, 0
    );

    gl.enableVertexAttribArray(this.attribs.vp);

    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.normals);
    gl.vertexAttribPointer(
      this.attribs.vn,
      3, gl.FLOAT, gl.FALSE,
      0, 0
    );
    gl.enableVertexAttribArray(this.attribs.vn);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffers.indices);
    gl.drawElements(this.draw_mode, buffers.qty, gl.UNSIGNED_SHORT, 0);

    let lights = Array.from(game.all.get(Light));
    let lights_count = lights.length;
    let light_position = new Float32Array(lights_count * 3);
    let light_color = new Float32Array(lights_count * 3);
    let light_intensity = new Float32Array(lights_count);

    for (let i = 0; i < lights_count; i++) {
      let light_transform = lights[i].entity.get(Transform);
      let world_position = [
          light_transform.world.m41,
          light_transform.world.m42,
          light_transform.world.m43,
      ];
      light_position.set(world_position, i * 3);
      light_color.set(lights[i].color_vec, i * 3);
      light_intensity[i] = lights[i].intensity;
    }

    gl.uniform1i(this.uniforms.al, lights_count);

    gl.uniform3fv(this.uniforms.lp, light_position);
    gl.uniform3fv(this.uniforms.lc, light_color);
    gl.uniform1fv(this.uniforms.li, light_intensity);

  }
}

class WireframeMaterial extends BasicMaterial {
  constructor(options) {
    super(options);

    this.draw_mode = gl.LINE_STRIP;

  }
}

let BUILDING_TAG = 1;
let NEON_TAG = 2;
let POWERUP_TAG = 3;

let neon_material = new BasicMaterial();
neon_material.add_fog({
    color: hex_to_rgb(CLEAR_COLOR),
    distance: new Float32Array([NEON_FOG_MIN, NEON_FOG_MAX]),
});

let powerup_material = new BasicMaterial();

let building_material = new PhongMaterial();
building_material.add_fog({
    color: hex_to_rgb(CLEAR_COLOR),
    distance: new Float32Array([BUILDING_FOG_MIN, BUILDING_FOG_MAX]),
});

let wireframe_material = new WireframeMaterial();

function create_group(position) {
    return new Entity({
        components: [
            new Transform({position})
        ]
    });
}

function create_floor({position, scale}) {
    let plane = new Box();
    plane.get(Render).set({
        material: wireframe_material,
        color: WIREFRAME_COLOR,
        tag: BUILDING_TAG,
    });
    plane.get(Transform).set({
        position,
        scale
    });
    return plane;
}

function create_light({position, color, intensity}) {
    return new Entity({
        components: [
            new Transform({position}),
            new NearbyLight({color, intensity}),
        ]
    });
}

function create_neon({position, scale, color, is_north_south, is_negative}) {
    let group = create_group(position);

    let neon = new Box();
    neon.get(Render).set({
        material: wireframe_material,
        color,
        tag: NEON_TAG,
    });
    neon.get(Transform).set({
        scale
    });
    group.add(neon);

    let neon_light = create_light({
        position: [
            is_north_south ? 0 : is_negative * NEON_LIGHT_MOUNT,
            0,
            is_north_south ? is_negative * NEON_LIGHT_MOUNT : 0
        ],
        color,
        intensity: NEON_INTENSITY,
    });
    group.add(neon_light);
    return group;
}

function create_building({position, scale, neons}) {
    let group = create_group(position);

    let building = new Box();
    building.get(Render).set({
        material: wireframe_material,
        color: WIREFRAME_COLOR,
        tag: BUILDING_TAG,
    });
    building.get(Transform).set({scale});
    group.add(building);

    for (let neon_opts of neons) {
        let neon = create_neon(neon_opts);
        group.add(neon);
    }

    return group;
}

function create_exit(options) {
    let exit = new Box();
    exit.get(Render).set({
        material: powerup_material,
        color: POWERUP_COLOR,
    });
    exit.get(Transform).set(options);
    exit.attach(new Trigger({
        radius: 0.6,
        action: [EXIT]
    }));
    exit.attach(new Rotator({
        speed: [0, 0.0001, 0],
    }));
    return exit;
}

function create_powerup({system, position}) {
    let cube = new Box();
    cube.get(Render).set({
        material: wireframe_material,
        color: POWERUP_COLOR,
        tag: POWERUP_TAG,
    });
    cube.get(Transform).set({position});
    cube.attach(new Trigger({
        radius: 1,
        action: [ACTIVATE, system]
    }));
    cube.attach(new Rotator({
        speed: [0.0001, 0.0002, 0.0003],
    }));

    let light = new Entity({
        components: [
            new Transform(),
            new Light({
                color: POWERUP_COLOR,
                intensity: POWERUP_INTENSITY,
            }),
        ]
    });
    cube.add(light);
    return cube;
}

var size = [
	63,
	63
];
var buildings = [
	[
		48,
		0,
		54,
		5,
		37
	],
	[
		17,
		0,
		23,
		7,
		39
	],
	[
		25,
		1,
		32,
		5,
		35
	],
	[
		6,
		2,
		13,
		9,
		35
	],
	[
		42,
		3,
		45,
		10,
		22
	],
	[
		35,
		4,
		42,
		7,
		32
	],
	[
		59,
		5,
		63,
		13,
		23
	],
	[
		48,
		12,
		54,
		18,
		28
	],
	[
		33,
		12,
		38,
		17,
		11
	],
	[
		24,
		12,
		31,
		15,
		17
	],
	[
		1,
		12,
		5,
		21,
		25
	],
	[
		44,
		13,
		46,
		20,
		18
	],
	[
		11,
		13,
		14,
		16,
		18
	],
	[
		8,
		13,
		11,
		19,
		24
	],
	[
		42,
		14,
		44,
		17,
		15
	],
	[
		60,
		16,
		63,
		24,
		32
	],
	[
		17,
		16,
		22,
		22,
		17
	],
	[
		11,
		16,
		14,
		19,
		12
	],
	[
		24,
		17,
		29,
		20,
		12
	],
	[
		34,
		19,
		36,
		20,
		3
	],
	[
		51,
		20,
		54,
		25,
		18
	],
	[
		37,
		20,
		40,
		22,
		11
	],
	[
		33,
		20,
		36,
		23,
		4
	],
	[
		50,
		21,
		51,
		22,
		17
	],
	[
		46,
		21,
		48,
		24,
		3
	],
	[
		43,
		21,
		46,
		27,
		5
	],
	[
		28,
		21,
		31,
		27,
		3
	],
	[
		10,
		21,
		15,
		24,
		22
	],
	[
		56,
		22,
		60,
		27,
		8
	],
	[
		39,
		24,
		40,
		26,
		2
	],
	[
		37,
		24,
		39,
		29,
		3
	],
	[
		34,
		24,
		36,
		27,
		4
	],
	[
		24,
		24,
		28,
		27,
		11
	],
	[
		19,
		25,
		22,
		30,
		5
	],
	[
		0,
		26,
		3,
		36,
		34
	],
	[
		48,
		27,
		54,
		30,
		6
	],
	[
		5,
		27,
		8,
		33,
		15
	],
	[
		41,
		28,
		46,
		32,
		14
	],
	[
		33,
		28,
		36,
		31,
		7
	],
	[
		25,
		29,
		29,
		32,
		2
	],
	[
		24,
		29,
		25,
		31,
		1
	],
	[
		48,
		30,
		54,
		33,
		20
	],
	[
		19,
		30,
		22,
		31,
		3
	],
	[
		58,
		31,
		62,
		38,
		28
	],
	[
		20,
		33,
		22,
		40,
		13
	],
	[
		33,
		34,
		36,
		39,
		21
	],
	[
		49,
		35,
		52,
		39,
		13
	],
	[
		44,
		35,
		47,
		44,
		20
	],
	[
		36,
		35,
		41,
		38,
		13
	],
	[
		24,
		35,
		27,
		40,
		3
	],
	[
		12,
		35,
		17,
		38,
		8
	],
	[
		0,
		36,
		7,
		41,
		28
	],
	[
		54,
		40,
		63,
		43,
		20
	],
	[
		24,
		40,
		31,
		43,
		5
	],
	[
		16,
		40,
		18,
		42,
		7
	],
	[
		10,
		40,
		14,
		44,
		14
	],
	[
		46,
		41,
		51,
		45,
		8
	],
	[
		33,
		41,
		39,
		45,
		30
	],
	[
		16,
		42,
		21,
		44,
		11
	],
	[
		37,
		43,
		40,
		46,
		4
	],
	[
		25,
		44,
		30,
		46,
		8
	],
	[
		0,
		45,
		7,
		49,
		19
	],
	[
		17,
		46,
		21,
		48,
		8
	],
	[
		57,
		47,
		63,
		54,
		35
	],
	[
		44,
		49,
		49,
		54,
		27
	],
	[
		33,
		50,
		38,
		56,
		18
	],
	[
		24,
		50,
		29,
		57,
		16
	],
	[
		15,
		50,
		19,
		54,
		28
	],
	[
		47,
		52,
		51,
		56,
		13
	],
	[
		5,
		52,
		12,
		58,
		39
	],
	[
		34,
		54,
		42,
		60,
		7
	],
	[
		20,
		57,
		31,
		63,
		41
	],
	[
		46,
		58,
		54,
		63,
		36
	]
];
var start = [
	33,
	18
];
var end = [
	14,
	29
];
var items = [
	[
		"SOLID",
		47,
		25
	],
	[
		"COLOR",
		38,
		39
	],
	[
		"MOUSELOOK",
		32,
		26
	],
	[
		"CLOCK",
		23,
		41
	],
	[
		"COMPASS",
		37,
		30
	]
];
var map = {
	size: size,
	buildings: buildings,
	start: start,
	end: end,
	items: items
};

function create_game() {
    let game = new Game({
      width: window.innerWidth,
      height: window.innerHeight,
      far: 126,
      clear_color: CLEAR_COLOR,
    });

    game.perspe_matrix = clone$1(game.projMatrix);
    game.setup_ortho_camera();

    game.canvas.addEventListener(
        "click", () => document.body.requestPointerLock());

    game.camera.get(Transform).set({
        position: [
            map.start[0] * SCALE,
            1.75,
            map.start[1] * SCALE],
    });

    game.camera.detach(Move);

    let grid_move = new GridMove();
    game.camera.attach(grid_move);

    grid_move.set({
        keyboard_controlled: true,
        mouse_controlled: false,
        move_speed: 7,
        rotate_speed: 0,
        buildings: [],
        size: map.size.map(n => n * SCALE),
    });

    game.camera.attach(new Actor());
    game.camera.attach(new EnergySaver());

    // Remove the default light.
    game.remove(game.light);

    let floor = create_floor({
        position: [0, -0.5, 0],
        scale: [map.size[0] * SCALE * 10, 1, map.size[1] * SCALE * 10],
    });
    game.add(floor);

    for (let [x1, y1, x2, y2, h] of map.buildings) {
        let xsize = Math.abs(x2 - x1) * SCALE;
        let zsize = Math.abs(y2 - y1) * SCALE;

        let center_x = x1 * SCALE + (xsize/2);
        let center_z = y1 * SCALE + (zsize/2);

        let height = h * SCALE;

        let building = create_building({
            position: [center_x, height / 2, center_z],
            scale: [xsize, height, zsize],
            neons: new Array(integer(2, 4)).fill(0).map((_, index, arr) => {
                let is_north_south = element_of([true, false]);
                let is_negative = element_of([1, -1]);
                let neon_height = (height * NEON_SCALE) / (arr.length + 0.5);
                return {
                    position: [
                      is_north_south ? 0 : (is_negative * (xsize / 2) + (is_negative * 0.2)),
                      height / 2 - ((neon_height + 0.5) * (index + 1)),
                      is_north_south ? (is_negative * (zsize / 2) + (is_negative * 0.2)) : 0],
                    scale: [
                      is_north_south ? xsize * NEON_SCALE : 0.1,
                      neon_height,
                      is_north_south ? 0.1 : zsize * NEON_SCALE
                    ],
                    color: WIREFRAME_COLOR,
                    is_north_south,
                    is_negative
                }
            }),
        });
        game.add(building);
        grid_move.buildings.push([center_x - xsize / 2, center_x + xsize / 2, center_z - zsize / 2, center_z + zsize/2]);
    }

    for (let [name, x, z] of map.items) {
        game.add(create_powerup({
            system: sys[name],
            position: [x * SCALE, 1.75, z * SCALE]}));
    }

    window.game = game;
    return game;
}

function reveal_exit(game) {
    let height = 50 * SCALE;
    game.add(create_exit({
        position: [
            map.end[0] * SCALE,
            height / 2,
            map.end[1] * SCALE],
        scale: [5 * SCALE, 200, 5 * SCALE],
    }));
}

function destroy_game(game) {
    game.stop();
    game.destroy();
    game.canvas.remove();
}

function random_color() {
    let hue = float(HUE_MIN, HUE_MAX);
    return rgb_to_hex(
        hsl_to_rgb(hue > 0 ? hue + 1 : hue, SATURATION, LUMINANCE));
}

function activate(game, system) {
    switch (system) {
        case SOLID:
            for (let render of game.all.get(Render)) {
                switch (render.tag) {
                    case BUILDING_TAG:
                        render.material = building_material;
                        render.color = BUILDING_COLOR;
                        continue;
                    case NEON_TAG:
                        render.material = neon_material;
                        continue
                    case POWERUP_TAG:
                        render.material = powerup_material;
                }
            }
            break;
        case COLOR:
            for (let render of game.all.get(Render)) {
                switch (render.tag) {
                    case NEON_TAG: {
                        let color = random_color();
                        render.set({color});
                        for (let light of render.entity.parent.iterall(NearbyLight)) {
                            light.set({color});
                        }
                    }
                }
            }
            break;
        case MOUSELOOK:
            game.camera.get(GridMove).set({
                mouse_controlled: true,
                rotate_speed: .5,
            });
            break;
        default:
            break;
    }
}

let init = {
    view: "intro",
    systems: {
        [HUD]: false,
        [PERSPECTIVE]: false,
        [SOLID]: false,
        [COLOR]: false,
        [CLOCK]: false,
        [COMPASS]: false,
        [MOUSELOOK]: false,
        [GRID]: true,
    },
};

function reducer(state = init, action, args) {
    switch (action) {
        case DIAGNOSTIC:
            return Object.assign({}, state, {
                view: "diag",
            });
        case START:
            document.body.requestPointerLock();
            return Object.assign({}, state, {
                view: "play",
                game: create_game(),
                last: HUD,
                systems: Object.assign({}, state.systems, {
                    [HUD]: true
                })
            });
        case ACTIVATE: {
            let [last] = args;
            activate(game, last);

            let systems_all = [...Object.values(state.systems)];
            let systems_active = systems_all.filter(x => x);
            // If this is the last system, reveal the exit.
            if (systems_all.length - systems_active.length === 1) {
                reveal_exit(game);
            }

            return Object.assign({}, state, {
                last,
                systems: Object.assign({}, state.systems, {
                    [last]: true
                })
            });
        }
        case EXIT:
            document.exitPointerLock();
            destroy_game(state.game);
            return Object.assign({}, state, {
                view: "outro",
            });
        default:
            return state;
    }
}

//import with_logger from "./innerself/logger";
let {attach, connect, dispatch: dispatch$1, html} =
    //createStore(with_logger(reducer));
    createStore(reducer);

function digest(text) {
    return [...text]
        .map(ch => ch.codePointAt(0))
        .reduce((acc, cur) => acc + cur, 0);
}

function clamp(num, min, max) {
    return Math.min(max, Math.max(min, num));
}

function map$1(num, in1, in2, out1, out2) {
    return out1 + (out2 - out1) * ((num - in1) / (in2 - in1));
}

function Glitch(text) {
    // A deterministic digest function provides variety and ensures
    // subsequent renders given the same state produce the same output.
    let i = digest(text) % 20;
    return html`
        <div class="g">
            <div class="g1 n${i}">${text}</div>
            <div class="g2 n${i}">${text}</div>
            <div class="g3 n${i}">${text}</div>
        </div>
    `;
}

function set_glitch(line, content) {
    for (let glitchPart of line.querySelectorAll(".g > div")) {
        glitchPart.innerHTML = content;
    }
}

function Line(text) {
    return html`
        <div class="l">
            ${Glitch(text)}
        </div>
    `;
}

function Story(text) {
    return new class extends Component {
        before(root) {
            clearInterval(this.interval);
            root.removeEventListener("click", this.onclick);
        }

        after(root) {
            let div = document.createElement("div");
            let lines = text.split("\n")[Symbol.iterator]();
            let container = root.querySelector(".t");

            let update = () => {
                // Animate text display
                let next = lines.next();
                if (next.done) {
                    clearInterval(this.interval);
                } else {
                    div.innerHTML = Line(next.value);
                    container.appendChild(div.firstElementChild);
                }
            };

            this.onclick = () => {
                this.before(root);
                this.interval = setInterval(update, 100);
            };

            this.interval = setInterval(update, 1000);
            root.addEventListener("click", this.onclick);
        }

        render() {
            return html`
                <div class="m s">
                    <div class="t" digest="${digest(text)}"></div>
                </div>
            `;
        }
    }
}

// No more than 55 chars per line.
// Any HTML must be on a single line.
let intro = `
<div class="h">LOGOUT</div>

In 2018, people live their lives in virtual reality.
Most never leave the community clusters assigned
to them at birth. A handful of lucky ones migrate
to premium clusters which boast 100% uptime.

You are not one of the lucky ones.

The community VR cluster you've spent your life in
has had a critical failure. The reboot has reset
the entire world.

Find the exit and log out into the reality.

<button onclick="dispatch(${DIAGNOSTIC});event.stopPropagation()">Run system diagnostic</button>
`;

// No more than 55 chars per line.
// Any HTML must be on a single line.
let outro = `\
Initiating logout sequence…

Reticulating splines…
Stopping services…
Clearing caches…

Logout complete

<a href="https://twitter.com/hashtag/js13k">Enter the real world</a>
`;

function Block(area, lines = [], {align = "stretch", justify = "stretch", cls = ""} = {}) {
    return html`
        <div class="b ${area} ${cls}"
            style="grid-area: ${area}; align-self: ${align}; justify-self: ${justify};">
            ${lines.map(Line)}
        </div>
    `;
}

function get_system_status(systems) {
    let system_status = [];
    for (let [sys, on] of Object.entries(systems)) {
        let status = on
            ? "Online"
            : "Offline";
        system_status.push(`${sys} = ${status}`);
    }
    return system_status;
}

function Status(cls, styles, systems) {
    return Block(cls, [
        "Running analysis",
        ...get_system_status(systems),
        "<div class=e>Assessment complete</div>",
    ], styles);
}

// Generate animated code display
function *generateCode() {
    let lines = fragment.toString()
        .split("\n").slice(7, -2)
        .map(line => line.trim())
        .filter(Boolean);
    let i = 0;
    while (1) {
        yield lines[i++ % lines.length];
    }
}

var code_anim = generateCode();

function Code(cls, styles) {
    return new class extends Component {
        before() {
            clearInterval(this.interval);
        }

        after(root) {
            let div = document.createElement("div");
            let container = root.querySelector(`.${cls}`);

            this.interval = setInterval(() => {
                // Animate code display
                container.removeChild(container.firstElementChild);
                div.innerHTML = Line(code_anim.next().value);
                container.appendChild(div.firstElementChild);
            }, 1000);
        }

        render() {
            return Block(
                cls,
                new Array(10).fill(""),
                styles
            );
        }
    }
}

let formatters = [
    // Weekday and Date
    new Intl.DateTimeFormat("en", {
        weekday: "short",
        month: "short",
        day: "2-digit",
        year: "numeric",
    }),
    // Time
    new Intl.DateTimeFormat("en", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
    })
];

function Time(cls, styles) {
    return new class extends Component {
        before() {
            clearInterval(this.interval);
        }

        after(root) {
            let lines = root.querySelectorAll(`.${cls} .l`);
            this.interval = setInterval(() => {
                // Update datetime
                let now = new Date();
                for (let [i, line] of lines.entries()) {
                    line.innerHTML = Glitch(formatters[i].format(now));
                }
            }, 1000);
        }

        render() {
            let now = new Date();
            return Block(cls, [
                formatters[0].format(now),
                formatters[1].format(now),
            ], styles);
        }
    }
}

let compass = "NW ---- N ---- NE ---- E ---- SE ---- S ---- SW ---- W ---- ";
let compass_length = compass.length;
compass = compass + compass + compass;
let step = (Math.PI * 2) / compass_length;
let visible_characters = 18;

function Compass({game}, cls, styles) {
    let half_fov = to_radian(game.fov / 2);
    return new class extends Component {
        before() {
            game.off("afterrender", this.up);
        }

        after(root) {
            let nswe = root.querySelector(`.${cls} > :first-child`);
            let radar = root.querySelector(`.${cls} > :last-child`);
            this.up = game.on("afterrender", () => {
                let transform = game.camera.get(Transform);
                let forward$$1 = transform.forward;
                let sign = forward$$1[0] > 0 ? -1 : 1;
                let start = Math.round(angle([0, 0, 1], forward$$1) / step) * sign;
                let section = (compass + compass + compass).slice(compass_length + start, compass_length + start + visible_characters);
                set_glitch(nswe, section);

                let counts = new Array(visible_characters).fill(0);
                for (let trigger of game.all.get(Trigger)) {
                    let trigger_position = trigger.entity.get(Transform).position;
                    // Project the position to eye level.
                    trigger_position[1] = 1.75;
                    let direction = zero.slice();
                    subtract(direction, trigger_position, transform.position);
                    normalize(direction, direction);

                    // vec3.angle returns angles in [0, Math.PI], regardless of
                    // whether the trigger is on the left or on the right of the
                    // forward vector. Calculate the angle to the left vector,
                    // too, and use it to compute the sign.
                    let rad = angle(transform.forward, direction);
                    rad = clamp(rad, 0, half_fov);
                    rad *= Math.sign(angle(transform.left, direction) - Math.PI/2);

                    let cell = Math.round(map$1(rad, -half_fov, half_fov, 0, visible_characters - 1));
                    counts[cell]++;
                }

                set_glitch(radar, counts.map(n => n > 0 ? "^" : "&nbsp;").join(""));
            });
        }

        render() {
            return Block(
                cls,
                ["Compass", "Radar"],
                styles
            );
        }
    }
}

var Compass$1 = connect(Compass);

function Matrix(cls, styles) {
    return new class extends Component {
        before() {
            game.off("afterrender", this.up);
        }

        after(root) {
            // Skip the header.
            let rows = Array.from(
                root.querySelectorAll(`.${cls} .l`)).slice(1);
            this.up = game.on("afterrender", () => {
                // Update local matrix display
                let matrix = game.camera.get(Transform).matrix.toFloat32Array();
                for (let [i, line] of rows.entries()) {
                    set_glitch(
                        line,
                        Array.from(matrix.slice(4 * i, 4 * i + 4), n => n.toFixed(3)).join(" "));
                }
            });
        }

        render() {
            return Block(cls, [
                "Entity matrix", "1", "2", "3", "4"
            ], styles);
        }
    }
}

class MatrixTween extends Tween {
  action() {
    for (let i = 1; i < 5; i++) {
      for (let j = 1; j < 5; j++) {
        let m = `m${i}${j}`;
        this.object[m] = this.from[m] + this.current_step * (this.to[m] - this.from[m]);
      }
    }
  }

  pre_start() {
    super.pre_start();
    this.from = clone$1(this.object);
  }
}

function HUD$1({game, last, systems}) {
    return new class extends Component {
        after() {
            // Set up timed events the first time we see the HUD.
            if (last === HUD) {
                setTimeout(() =>
                    (new MatrixTween({
                        object: game.projMatrix,
                        to: game.perspe_matrix,
                        time: 3000,
                        game: game
                    })).start(),
                    5000);

                setTimeout(() =>
                    dispatch(ACTIVATE, PERSPECTIVE),
                    7000);
            }
        }

        render() {
            return html`
                <div class="m u">
                    ${systems[HUD] && Status("tl", {}, systems)}

                    ${systems[COMPASS] && Compass$1("tm", {
                        justify: "center"
                    })}

                    ${systems[CLOCK] && Time("tr", {
                        justify: "end"
                    })}

                    ${Block("mm", [
                        last,
                        "<div class='h e'>Activated</div>",
                    ], { align: "center", justify: "center", cls: "f" })}

                    ${systems[HUD] && Block("mr", [
                        "Active objectives",
                        "> 01. Bring Systems Online",
                        "> 02. Locate exit",
                        "> 03. Init logout sequence",
                    ])}

                    ${systems[PERSPECTIVE] && Matrix("bl", {
                        align: "end"
                    })}

                    ${systems[SOLID] && Code("br", {
                        align: "end"
                    })}
                </div>
            `;
        }
    }
}

var HUD$2 = connect(HUD$1);

function App({view, systems}) {
    switch (view) {
        case "intro":
            return Story(intro);
        case "diag": {
            let offlines = get_system_status(systems);
            let wasd = offlines.pop();
            let diagnostic = [
                "Running analysis…\n",
                ...offlines,
                `\n${wasd}`,
                `\n<button onclick="dispatch(${START});event.stopPropagation()">Initiate recovery sequence</button>`
            ].join("\n");
            return Story(diagnostic);
        }
        case "play":
            return HUD$2();
        case "outro":
            return Story(outro);
    }
}

var App$1 = connect(App);

// Generate glitch animations
let sheet = document.styleSheets[0];
let steps = 20;
let percent = new Intl.NumberFormat("en", {style: "percent"});
for (let i = 0; i < 20; i++) {
    sheet.insertRule(`
        @keyframes n${i} {
            ${new Array(steps).fill(1).map((_, step) => `
                ${percent.format(step / steps)} {
                    clip-path: inset(
                        ${percent.format(Math.random())} 0
                        ${percent.format(Math.random())}
                    );
                }
            `).join("")}
        }
    `);
    sheet.insertRule(`
        .g2.n${i} {
            animation: n${i} ${Math.random() * 5}s linear infinite alternate;
        }
    `);
    sheet.insertRule(`
        .g3.n${i} {
            animation: n${i} ${Math.random() * 5}s linear infinite alternate;
        }
    `);
}

attach(App$1, document.querySelector("#root"));
window.dispatch = dispatch$1;

}());
