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

const HUD = "Heads-Up Display";
const PERSPECTIVE = "Perspective";
const SOLID = "Light Sensor";
const COLOR = "Chromatic Sampling";
const CLOCK = "Low-Res Timer";
const COMPASS = "Compass";
const MOUSELOOK = "Gimbal Mount";
const GRID = "WASD Movement";


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

const DIAGNOSTIC = 0;
const START = 1;
const ACTIVATE = 2;
const EXIT = 3;

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
function transformMat4(out, a, m) {
  let x = a[0], y = a[1], z = a[2];
  let w = m[3] * x + m[7] * y + m[11] * z + m[15];
  w = w || 1.0;
  out[0] = (m[0] * x + m[4] * y + m[8] * z + m[12]) / w;
  out[1] = (m[1] * x + m[5] * y + m[9] * z + m[13]) / w;
  out[2] = (m[2] * x + m[6] * y + m[10] * z + m[14]) / w;
  return out;
}

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

const V = Float32Array;

const zero = V.of(0, 0, 0);
const unit = V.of(1, 1, 1);
const left = V.of(1, 0, 0);
const up = V.of(0, 1, 0);
const forward = V.of(0, 0, 1);

const of = (...vals) => V.of(...vals);

/**
 * 4x4 Matrix<br>Format: column-major, when typed out it looks like row-major<br>The matrices are being post multiplied.
 * @module mat4
 */

/**
 * Creates a new identity mat4
 *
 * @returns {mat4} a new 4x4 matrix
 */
function create$1() {
  let out = new ARRAY_TYPE(16);
  if(ARRAY_TYPE != Float32Array) {
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = 0;
    out[6] = 0;
    out[7] = 0;
    out[8] = 0;
    out[9] = 0;
    out[11] = 0;
    out[12] = 0;
    out[13] = 0;
    out[14] = 0;
  }
  out[0] = 1;
  out[5] = 1;
  out[10] = 1;
  out[15] = 1;
  return out;
}

/**
 * Creates a new mat4 initialized with values from an existing matrix
 *
 * @param {mat4} a matrix to clone
 * @returns {mat4} a new 4x4 matrix
 */
function clone$1(a) {
  let out = new ARRAY_TYPE(16);
  out[0] = a[0];
  out[1] = a[1];
  out[2] = a[2];
  out[3] = a[3];
  out[4] = a[4];
  out[5] = a[5];
  out[6] = a[6];
  out[7] = a[7];
  out[8] = a[8];
  out[9] = a[9];
  out[10] = a[10];
  out[11] = a[11];
  out[12] = a[12];
  out[13] = a[13];
  out[14] = a[14];
  out[15] = a[15];
  return out;
}

/**
 * Copy the values from one mat4 to another
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the source matrix
 * @returns {mat4} out
 */


/**
 * Create a new mat4 with the given values
 *
 * @param {Number} m00 Component in column 0, row 0 position (index 0)
 * @param {Number} m01 Component in column 0, row 1 position (index 1)
 * @param {Number} m02 Component in column 0, row 2 position (index 2)
 * @param {Number} m03 Component in column 0, row 3 position (index 3)
 * @param {Number} m10 Component in column 1, row 0 position (index 4)
 * @param {Number} m11 Component in column 1, row 1 position (index 5)
 * @param {Number} m12 Component in column 1, row 2 position (index 6)
 * @param {Number} m13 Component in column 1, row 3 position (index 7)
 * @param {Number} m20 Component in column 2, row 0 position (index 8)
 * @param {Number} m21 Component in column 2, row 1 position (index 9)
 * @param {Number} m22 Component in column 2, row 2 position (index 10)
 * @param {Number} m23 Component in column 2, row 3 position (index 11)
 * @param {Number} m30 Component in column 3, row 0 position (index 12)
 * @param {Number} m31 Component in column 3, row 1 position (index 13)
 * @param {Number} m32 Component in column 3, row 2 position (index 14)
 * @param {Number} m33 Component in column 3, row 3 position (index 15)
 * @returns {mat4} A new mat4
 */


/**
 * Set the components of a mat4 to the given values
 *
 * @param {mat4} out the receiving matrix
 * @param {Number} m00 Component in column 0, row 0 position (index 0)
 * @param {Number} m01 Component in column 0, row 1 position (index 1)
 * @param {Number} m02 Component in column 0, row 2 position (index 2)
 * @param {Number} m03 Component in column 0, row 3 position (index 3)
 * @param {Number} m10 Component in column 1, row 0 position (index 4)
 * @param {Number} m11 Component in column 1, row 1 position (index 5)
 * @param {Number} m12 Component in column 1, row 2 position (index 6)
 * @param {Number} m13 Component in column 1, row 3 position (index 7)
 * @param {Number} m20 Component in column 2, row 0 position (index 8)
 * @param {Number} m21 Component in column 2, row 1 position (index 9)
 * @param {Number} m22 Component in column 2, row 2 position (index 10)
 * @param {Number} m23 Component in column 2, row 3 position (index 11)
 * @param {Number} m30 Component in column 3, row 0 position (index 12)
 * @param {Number} m31 Component in column 3, row 1 position (index 13)
 * @param {Number} m32 Component in column 3, row 2 position (index 14)
 * @param {Number} m33 Component in column 3, row 3 position (index 15)
 * @returns {mat4} out
 */



/**
 * Set a mat4 to the identity matrix
 *
 * @param {mat4} out the receiving matrix
 * @returns {mat4} out
 */
function identity(out) {
  out[0] = 1;
  out[1] = 0;
  out[2] = 0;
  out[3] = 0;
  out[4] = 0;
  out[5] = 1;
  out[6] = 0;
  out[7] = 0;
  out[8] = 0;
  out[9] = 0;
  out[10] = 1;
  out[11] = 0;
  out[12] = 0;
  out[13] = 0;
  out[14] = 0;
  out[15] = 1;
  return out;
}

/**
 * Transpose the values of a mat4
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the source matrix
 * @returns {mat4} out
 */


/**
 * Inverts a mat4
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the source matrix
 * @returns {mat4} out
 */
function invert(out, a) {
  let a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3];
  let a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7];
  let a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11];
  let a30 = a[12], a31 = a[13], a32 = a[14], a33 = a[15];

  let b00 = a00 * a11 - a01 * a10;
  let b01 = a00 * a12 - a02 * a10;
  let b02 = a00 * a13 - a03 * a10;
  let b03 = a01 * a12 - a02 * a11;
  let b04 = a01 * a13 - a03 * a11;
  let b05 = a02 * a13 - a03 * a12;
  let b06 = a20 * a31 - a21 * a30;
  let b07 = a20 * a32 - a22 * a30;
  let b08 = a20 * a33 - a23 * a30;
  let b09 = a21 * a32 - a22 * a31;
  let b10 = a21 * a33 - a23 * a31;
  let b11 = a22 * a33 - a23 * a32;

  // Calculate the determinant
  let det = b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;

  if (!det) {
    return null;
  }
  det = 1.0 / det;

  out[0] = (a11 * b11 - a12 * b10 + a13 * b09) * det;
  out[1] = (a02 * b10 - a01 * b11 - a03 * b09) * det;
  out[2] = (a31 * b05 - a32 * b04 + a33 * b03) * det;
  out[3] = (a22 * b04 - a21 * b05 - a23 * b03) * det;
  out[4] = (a12 * b08 - a10 * b11 - a13 * b07) * det;
  out[5] = (a00 * b11 - a02 * b08 + a03 * b07) * det;
  out[6] = (a32 * b02 - a30 * b05 - a33 * b01) * det;
  out[7] = (a20 * b05 - a22 * b02 + a23 * b01) * det;
  out[8] = (a10 * b10 - a11 * b08 + a13 * b06) * det;
  out[9] = (a01 * b08 - a00 * b10 - a03 * b06) * det;
  out[10] = (a30 * b04 - a31 * b02 + a33 * b00) * det;
  out[11] = (a21 * b02 - a20 * b04 - a23 * b00) * det;
  out[12] = (a11 * b07 - a10 * b09 - a12 * b06) * det;
  out[13] = (a00 * b09 - a01 * b07 + a02 * b06) * det;
  out[14] = (a31 * b01 - a30 * b03 - a32 * b00) * det;
  out[15] = (a20 * b03 - a21 * b01 + a22 * b00) * det;

  return out;
}

/**
 * Calculates the adjugate of a mat4
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the source matrix
 * @returns {mat4} out
 */


/**
 * Calculates the determinant of a mat4
 *
 * @param {mat4} a the source matrix
 * @returns {Number} determinant of a
 */


/**
 * Multiplies two mat4s
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the first operand
 * @param {mat4} b the second operand
 * @returns {mat4} out
 */
function multiply$1(out, a, b) {
  let a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3];
  let a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7];
  let a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11];
  let a30 = a[12], a31 = a[13], a32 = a[14], a33 = a[15];

  // Cache only the current line of the second matrix
  let b0  = b[0], b1 = b[1], b2 = b[2], b3 = b[3];
  out[0] = b0*a00 + b1*a10 + b2*a20 + b3*a30;
  out[1] = b0*a01 + b1*a11 + b2*a21 + b3*a31;
  out[2] = b0*a02 + b1*a12 + b2*a22 + b3*a32;
  out[3] = b0*a03 + b1*a13 + b2*a23 + b3*a33;

  b0 = b[4]; b1 = b[5]; b2 = b[6]; b3 = b[7];
  out[4] = b0*a00 + b1*a10 + b2*a20 + b3*a30;
  out[5] = b0*a01 + b1*a11 + b2*a21 + b3*a31;
  out[6] = b0*a02 + b1*a12 + b2*a22 + b3*a32;
  out[7] = b0*a03 + b1*a13 + b2*a23 + b3*a33;

  b0 = b[8]; b1 = b[9]; b2 = b[10]; b3 = b[11];
  out[8] = b0*a00 + b1*a10 + b2*a20 + b3*a30;
  out[9] = b0*a01 + b1*a11 + b2*a21 + b3*a31;
  out[10] = b0*a02 + b1*a12 + b2*a22 + b3*a32;
  out[11] = b0*a03 + b1*a13 + b2*a23 + b3*a33;

  b0 = b[12]; b1 = b[13]; b2 = b[14]; b3 = b[15];
  out[12] = b0*a00 + b1*a10 + b2*a20 + b3*a30;
  out[13] = b0*a01 + b1*a11 + b2*a21 + b3*a31;
  out[14] = b0*a02 + b1*a12 + b2*a22 + b3*a32;
  out[15] = b0*a03 + b1*a13 + b2*a23 + b3*a33;
  return out;
}

/**
 * Translate a mat4 by the given vector
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the matrix to translate
 * @param {vec3} v vector to translate by
 * @returns {mat4} out
 */


/**
 * Scales the mat4 by the dimensions in the given vec3 not using vectorization
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the matrix to scale
 * @param {vec3} v the vec3 to scale the matrix by
 * @returns {mat4} out
 **/


/**
 * Rotates a mat4 by the given angle around the given axis
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the matrix to rotate
 * @param {Number} rad the angle to rotate the matrix by
 * @param {vec3} axis the axis to rotate around
 * @returns {mat4} out
 */


/**
 * Rotates a matrix by the given angle around the X axis
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the matrix to rotate
 * @param {Number} rad the angle to rotate the matrix by
 * @returns {mat4} out
 */


/**
 * Rotates a matrix by the given angle around the Y axis
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the matrix to rotate
 * @param {Number} rad the angle to rotate the matrix by
 * @returns {mat4} out
 */


/**
 * Rotates a matrix by the given angle around the Z axis
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the matrix to rotate
 * @param {Number} rad the angle to rotate the matrix by
 * @returns {mat4} out
 */


/**
 * Creates a matrix from a vector translation
 * This is equivalent to (but much faster than):
 *
 *     mat4.identity(dest);
 *     mat4.translate(dest, dest, vec);
 *
 * @param {mat4} out mat4 receiving operation result
 * @param {vec3} v Translation vector
 * @returns {mat4} out
 */


/**
 * Creates a matrix from a vector scaling
 * This is equivalent to (but much faster than):
 *
 *     mat4.identity(dest);
 *     mat4.scale(dest, dest, vec);
 *
 * @param {mat4} out mat4 receiving operation result
 * @param {vec3} v Scaling vector
 * @returns {mat4} out
 */


/**
 * Creates a matrix from a given angle around a given axis
 * This is equivalent to (but much faster than):
 *
 *     mat4.identity(dest);
 *     mat4.rotate(dest, dest, rad, axis);
 *
 * @param {mat4} out mat4 receiving operation result
 * @param {Number} rad the angle to rotate the matrix by
 * @param {vec3} axis the axis to rotate around
 * @returns {mat4} out
 */


/**
 * Creates a matrix from the given angle around the X axis
 * This is equivalent to (but much faster than):
 *
 *     mat4.identity(dest);
 *     mat4.rotateX(dest, dest, rad);
 *
 * @param {mat4} out mat4 receiving operation result
 * @param {Number} rad the angle to rotate the matrix by
 * @returns {mat4} out
 */


/**
 * Creates a matrix from the given angle around the Y axis
 * This is equivalent to (but much faster than):
 *
 *     mat4.identity(dest);
 *     mat4.rotateY(dest, dest, rad);
 *
 * @param {mat4} out mat4 receiving operation result
 * @param {Number} rad the angle to rotate the matrix by
 * @returns {mat4} out
 */


/**
 * Creates a matrix from the given angle around the Z axis
 * This is equivalent to (but much faster than):
 *
 *     mat4.identity(dest);
 *     mat4.rotateZ(dest, dest, rad);
 *
 * @param {mat4} out mat4 receiving operation result
 * @param {Number} rad the angle to rotate the matrix by
 * @returns {mat4} out
 */


/**
 * Creates a matrix from a quaternion rotation and vector translation
 * This is equivalent to (but much faster than):
 *
 *     mat4.identity(dest);
 *     mat4.translate(dest, vec);
 *     let quatMat = mat4.create();
 *     quat4.toMat4(quat, quatMat);
 *     mat4.multiply(dest, quatMat);
 *
 * @param {mat4} out mat4 receiving operation result
 * @param {quat4} q Rotation quaternion
 * @param {vec3} v Translation vector
 * @returns {mat4} out
 */


/**
 * Creates a new mat4 from a dual quat.
 *
 * @param {mat4} out Matrix
 * @param {quat2} a Dual Quaternion
 * @returns {mat4} mat4 receiving operation result
 */


/**
 * Returns the translation vector component of a transformation
 *  matrix. If a matrix is built with fromRotationTranslation,
 *  the returned vector will be the same as the translation vector
 *  originally supplied.
 * @param  {vec3} out Vector to receive translation component
 * @param  {mat4} mat Matrix to be decomposed (input)
 * @return {vec3} out
 */


/**
 * Returns the scaling factor component of a transformation
 *  matrix. If a matrix is built with fromRotationTranslationScale
 *  with a normalized Quaternion paramter, the returned vector will be
 *  the same as the scaling vector
 *  originally supplied.
 * @param  {vec3} out Vector to receive scaling factor component
 * @param  {mat4} mat Matrix to be decomposed (input)
 * @return {vec3} out
 */


/**
 * Returns a quaternion representing the rotational component
 *  of a transformation matrix. If a matrix is built with
 *  fromRotationTranslation, the returned quaternion will be the
 *  same as the quaternion originally supplied.
 * @param {quat} out Quaternion to receive the rotation component
 * @param {mat4} mat Matrix to be decomposed (input)
 * @return {quat} out
 */


/**
 * Creates a matrix from a quaternion rotation, vector translation and vector scale
 * This is equivalent to (but much faster than):
 *
 *     mat4.identity(dest);
 *     mat4.translate(dest, vec);
 *     let quatMat = mat4.create();
 *     quat4.toMat4(quat, quatMat);
 *     mat4.multiply(dest, quatMat);
 *     mat4.scale(dest, scale)
 *
 * @param {mat4} out mat4 receiving operation result
 * @param {quat4} q Rotation quaternion
 * @param {vec3} v Translation vector
 * @param {vec3} s Scaling vector
 * @returns {mat4} out
 */
function fromRotationTranslationScale(out, q, v, s) {
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

  out[0] = (1 - (yy + zz)) * sx;
  out[1] = (xy + wz) * sx;
  out[2] = (xz - wy) * sx;
  out[3] = 0;
  out[4] = (xy - wz) * sy;
  out[5] = (1 - (xx + zz)) * sy;
  out[6] = (yz + wx) * sy;
  out[7] = 0;
  out[8] = (xz + wy) * sz;
  out[9] = (yz - wx) * sz;
  out[10] = (1 - (xx + yy)) * sz;
  out[11] = 0;
  out[12] = v[0];
  out[13] = v[1];
  out[14] = v[2];
  out[15] = 1;

  return out;
}

/**
 * Creates a matrix from a quaternion rotation, vector translation and vector scale, rotating and scaling around the given origin
 * This is equivalent to (but much faster than):
 *
 *     mat4.identity(dest);
 *     mat4.translate(dest, vec);
 *     mat4.translate(dest, origin);
 *     let quatMat = mat4.create();
 *     quat4.toMat4(quat, quatMat);
 *     mat4.multiply(dest, quatMat);
 *     mat4.scale(dest, scale)
 *     mat4.translate(dest, negativeOrigin);
 *
 * @param {mat4} out mat4 receiving operation result
 * @param {quat4} q Rotation quaternion
 * @param {vec3} v Translation vector
 * @param {vec3} s Scaling vector
 * @param {vec3} o The origin vector around which to scale and rotate
 * @returns {mat4} out
 */


/**
 * Calculates a 4x4 matrix from the given quaternion
 *
 * @param {mat4} out mat4 receiving operation result
 * @param {quat} q Quaternion to create matrix from
 *
 * @returns {mat4} out
 */


/**
 * Generates a frustum matrix with the given bounds
 *
 * @param {mat4} out mat4 frustum matrix will be written into
 * @param {Number} left Left bound of the frustum
 * @param {Number} right Right bound of the frustum
 * @param {Number} bottom Bottom bound of the frustum
 * @param {Number} top Top bound of the frustum
 * @param {Number} near Near bound of the frustum
 * @param {Number} far Far bound of the frustum
 * @returns {mat4} out
 */


/**
 * Generates a perspective projection matrix with the given bounds.
 * Passing null/undefined/no value for far will generate infinite projection matrix.
 *
 * @param {mat4} out mat4 frustum matrix will be written into
 * @param {number} fovy Vertical field of view in radians
 * @param {number} aspect Aspect ratio. typically viewport width/height
 * @param {number} near Near bound of the frustum
 * @param {number} far Far bound of the frustum, can be null or Infinity
 * @returns {mat4} out
 */
function perspective(out, fovy, aspect, near, far) {
  let f = 1.0 / Math.tan(fovy / 2), nf;
  out[0] = f / aspect;
  out[1] = 0;
  out[2] = 0;
  out[3] = 0;
  out[4] = 0;
  out[5] = f;
  out[6] = 0;
  out[7] = 0;
  out[8] = 0;
  out[9] = 0;
  out[11] = -1;
  out[12] = 0;
  out[13] = 0;
  out[15] = 0;
  if (far != null && far !== Infinity) {
    nf = 1 / (near - far);
    out[10] = (far + near) * nf;
    out[14] = (2 * far * near) * nf;
  } else {
    out[10] = -1;
    out[14] = -2 * near;
  }
  return out;
}

/**
 * Generates a perspective projection matrix with the given field of view.
 * This is primarily useful for generating projection matrices to be used
 * with the still experiemental WebVR API.
 *
 * @param {mat4} out mat4 frustum matrix will be written into
 * @param {Object} fov Object containing the following values: upDegrees, downDegrees, leftDegrees, rightDegrees
 * @param {number} near Near bound of the frustum
 * @param {number} far Far bound of the frustum
 * @returns {mat4} out
 */


/**
 * Generates a orthogonal projection matrix with the given bounds
 *
 * @param {mat4} out mat4 frustum matrix will be written into
 * @param {number} left Left bound of the frustum
 * @param {number} right Right bound of the frustum
 * @param {number} bottom Bottom bound of the frustum
 * @param {number} top Top bound of the frustum
 * @param {number} near Near bound of the frustum
 * @param {number} far Far bound of the frustum
 * @returns {mat4} out
 */
function ortho(out, left, right, bottom, top, near, far) {
  let lr = 1 / (left - right);
  let bt = 1 / (bottom - top);
  let nf = 1 / (near - far);
  out[0] = -2 * lr;
  out[1] = 0;
  out[2] = 0;
  out[3] = 0;
  out[4] = 0;
  out[5] = -2 * bt;
  out[6] = 0;
  out[7] = 0;
  out[8] = 0;
  out[9] = 0;
  out[10] = 2 * nf;
  out[11] = 0;
  out[12] = (left + right) * lr;
  out[13] = (top + bottom) * bt;
  out[14] = (far + near) * nf;
  out[15] = 1;
  return out;
}

/**
 * Generates a look-at matrix with the given eye position, focal point, and up axis.
 * If you want a matrix that actually makes an object look at another object, you should use targetTo instead.
 *
 * @param {mat4} out mat4 frustum matrix will be written into
 * @param {vec3} eye Position of the viewer
 * @param {vec3} center Point the viewer is looking at
 * @param {vec3} up vec3 pointing up
 * @returns {mat4} out
 */
function lookAt(out, eye, center, up) {
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

  if (Math.abs(eyex - centerx) < EPSILON &&
      Math.abs(eyey - centery) < EPSILON &&
      Math.abs(eyez - centerz) < EPSILON) {
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

  out[0] = x0;
  out[1] = y0;
  out[2] = z0;
  out[3] = 0;
  out[4] = x1;
  out[5] = y1;
  out[6] = z1;
  out[7] = 0;
  out[8] = x2;
  out[9] = y2;
  out[10] = z2;
  out[11] = 0;
  out[12] = -(x0 * eyex + x1 * eyey + x2 * eyez);
  out[13] = -(y0 * eyex + y1 * eyey + y2 * eyez);
  out[14] = -(z0 * eyex + z1 * eyey + z2 * eyez);
  out[15] = 1;

  return out;
}

/**
 * Generates a matrix that makes something look at something else.
 *
 * @param {mat4} out mat4 frustum matrix will be written into
 * @param {vec3} eye Position of the viewer
 * @param {vec3} center Point the viewer is looking at
 * @param {vec3} up vec3 pointing up
 * @returns {mat4} out
 */


/**
 * Returns a string representation of a mat4
 *
 * @param {mat4} a matrix to represent as a string
 * @returns {String} string representation of the matrix
 */


/**
 * Returns Frobenius norm of a mat4
 *
 * @param {mat4} a the matrix to calculate Frobenius norm of
 * @returns {Number} Frobenius norm
 */


/**
 * Adds two mat4's
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the first operand
 * @param {mat4} b the second operand
 * @returns {mat4} out
 */


/**
 * Subtracts matrix b from matrix a
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the first operand
 * @param {mat4} b the second operand
 * @returns {mat4} out
 */


/**
 * Multiply each element of the matrix by a scalar.
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the matrix to scale
 * @param {Number} b amount to scale the matrix's elements by
 * @returns {mat4} out
 */


/**
 * Adds two mat4's after multiplying each element of the second operand by a scalar value.
 *
 * @param {mat4} out the receiving vector
 * @param {mat4} a the first operand
 * @param {mat4} b the second operand
 * @param {Number} scale the amount to scale b's elements by before adding
 * @returns {mat4} out
 */


/**
 * Returns whether or not the matrices have exactly the same elements in the same position (when compared with ===)
 *
 * @param {mat4} a The first matrix.
 * @param {mat4} b The second matrix.
 * @returns {Boolean} True if the matrices are equal, false otherwise.
 */


/**
 * Returns whether or not the matrices have approximately the same elements in the same position.
 *
 * @param {mat4} a The first matrix.
 * @param {mat4} b The second matrix.
 * @returns {Boolean} True if the matrices are equal, false otherwise.
 */


/**
 * Alias for {@link mat4.multiply}
 * @function
 */


/**
 * Alias for {@link mat4.subtract}
 * @function
 */

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
  const matrix = Float32Array.of(...left, ...up, ...forward);
  return normalize$1(out, fromMat3(out, matrix));
}

function to_radian(a) {
  return a * Math.PI / 180;
}

const canvas = document.createElement('canvas');
const gl = canvas.getContext('webgl2');

function create_float_buffer(data) {
  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.STATIC_DRAW);

  return buffer;
}

function create_index_buffer(data) {
  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(data), gl.STATIC_DRAW);
  return buffer;
}

function create_shader_object(shader_type, source) {
  const shader = gl.createShader(shader_type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    throw gl.getShaderInfoLog(shader);
  }

  return shader;
}

function create_program_object(vs, fs) {
  const program = gl.createProgram();
  gl.attachShader(program, vs);
  gl.attachShader(program, fs);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    throw gl.getProgramInfoLog(program);
  }

  return program;
}

const default_options$1 = {
  components: [],
  skip: false,
};

class Entity {
  constructor(options = {}) {
    Object.assign(this, default_options$1, options);

    this.entities = new Set();
    this.components = new Map();

    for (let component of options.components) {
      this.add_component(component);
    }
  }

  add_component(component) {
    component.entity = this;
    component.mount();
    this.components.set(component.constructor, component);

    if (this.game) {
      if (!this.game.components.has(component.constructor)) {
        this.game.components.set(component.constructor, new Set());
      }
      this.game.components.get(component.constructor).add(component);
    }
  }

  remove_component(component) {
    let instance = this.components.get(component);
    this.components.delete(component);

    if (this.game && this.game.components.has(component)) {
      this.game.components.get(component).delete(instance);
    }
  }

  *iterall(component) {
    for (let child of this.entities) {
      if (child.components.has(component)) {
        yield child.components.get(component);
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

    const update_each = updatable => updatable.update(tick_delta);
    this.components.forEach(update_each);
    this.entities.forEach(update_each);
  }

  render(tick_delta) {
    if (this.skip) {
      return;
    }

    const render_each = renderable => renderable.render(tick_delta);
    this.components.forEach(render_each);
    this.entities.forEach(render_each);
  }
}

const default_options$3 = {
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
   * Called in Entity.add_component.
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

const default_options$2 = {
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
      world_matrix: create$1(),
      world_to_self: create$1()
    },  default_options$2, options));
  }

  get up() {
    const out = this.matrix.slice(4, 7);
    return normalize(out, out);
  }

  get forward() {
    const out = this.matrix.slice(8, 11);
    return normalize(out, out);
  }

  set position(vec) {
    fromRotationTranslationScale(this.matrix, this.rotation, vec, this.scale);
  }

  get position() {
    return this.matrix.slice(12, 15);
  }

  set scale(vec) {
    this._scale = vec;
    fromRotationTranslationScale(this.matrix, this.rotation, this.position, vec);
  }

  get scale() {
    return this._scale;
  }

  set rotation(quaternion) {
    this._rotation = quaternion;
    fromRotationTranslationScale(this.matrix, quaternion, this.position, this.scale);
  }

  get rotation() {
    return this._rotation;
  }

  look_at(target_position) {
    // Find the direction we're looking at. target_position must be given in
    // the current entity's coordinate space.  Use target's world_matrix and
    // the current entity's world_to_self to go from target's space to the
    // current entity space.
    const forward$$1 = zero.slice();
    subtract(forward$$1, target_position, this.position);
    normalize(forward$$1, forward$$1);

    // Assume that the world's horizontal plane is the frame of reference for
    // the look_at rotations. This should be fine for most game cameras which
    // don't need to roll.

    // Find left by projecting forward onto the world's horizontal plane and
    // rotating it 90 degress counter-clockwise. For any (x, y, z), the rotated
    // vector is (z, y, -x).
    const left$$1 = of(forward$$1[2], 0, -forward$$1[0]);
    normalize(left$$1, left$$1);

    // Find up by computing the cross-product of forward and left according to
    // the right-hand rule.
    const up$$1 = zero.slice();
    cross(up$$1, forward$$1, left$$1);

    // Create a quaternion out of the three axes. The vectors represent axes:
    // they are perpenticular and normalized.
    const rotation = create$2();
    set_axes(rotation, left$$1, up$$1, forward$$1);

    this.rotation = rotation;
  }

  rotate_along(vec, rad) {
    const rotation = create$2();
    setAxisAngle(rotation, vec, rad);

    // Quaternion multiplication: A * B applies the A rotation first, B second,
    // relative to the coordinate system resulting from A.
    multiply$2(rotation, this.rotation, rotation);
    this.rotation = rotation;
  }

  rotate_rl(rad) {
    this.rotate_along(up, rad);
  }

  rotate_ud(rad) {
    this.rotate_along(left, rad);
  }

  // XXX Add a relative_to attribute for interpreting the translation in spaces
  // other than the local space (relative to the parent).
  translate(vec) {
    const movement = zero.slice();
    add(movement, this.position, vec);
    this.position = movement;
  }

  get_view_matrix(out) {
    const look_at_vect = [];
    add(look_at_vect, this.position, this.forward);
    lookAt(out, this.position, look_at_vect, this.up);
    return out;
  }

  update() {
    if (this.entity.parent) {
      multiply$1(
        this.world_matrix,
        this.entity.parent.components.get(Transform).world_matrix,
        this.matrix
      );
    } else {
      this.world_matrix = this.matrix.slice();
    }

    invert(this.world_to_self, this.world_matrix);
  }
}

const default_options$4 = {
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
const KEY_ROTATION_DELTA = 3;

const default_options$5 = {
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
    const entity_transform = this.entity.components.get(Transform);
    const dist = tick_length / 1000 * this.move_speed;

    // The desired XZ direction vector in self space. This is what the user
    // wanted to do: walk forward/backward and left/right.
    const direction = of(l - r, 0, f - b);

    // Transform the input from self to local space.  If the user wanted to go
    // "left" in the entity's self space what does it mean in the local space?
    transformMat4(direction, direction, entity_transform.matrix);
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
    const mouse_delta = {
      x: yl * KEY_ROTATION_DELTA - yr * KEY_ROTATION_DELTA,
      y: pu * KEY_ROTATION_DELTA - pd * KEY_ROTATION_DELTA,
    };

    this.handle_mouse(tick_length, mouse_delta);
  }

  handle_mouse(tick_length, {x, y}) {
    const entity_transform = this.entity.components.get(Transform);
    // Check if there's any input to handle.
    if (x === 0 && y === 0) {
      return;
    }

    const time_delta = tick_length / 1000;
    const azimuth = this.rotate_speed * time_delta * x;
    const polar = this.rotate_speed * time_delta * y;

    // Polar (with the zenith being the Y axis) to Cartesian, but polar is
    // counted from Z to Y rather than from Y to Z, so we swap cos(polar) for
    // sin(polar) and vice versa.
    const forward$$1 = of(
      Math.cos(polar) * Math.sin(azimuth),
      Math.sin(polar),
      Math.cos(polar) * Math.cos(azimuth)
    );
    normalize(forward$$1, forward$$1);
    // Transform forward to the object's local coordinate space (relative to
    // the parent).
    transformMat4(forward$$1, forward$$1, entity_transform.matrix);
    entity_transform.look_at(forward$$1);
  }

  update(tick_length) {
    if (this.keyboard_controlled && this.entity.game) {
      const current_dirs = {};

      for (const [key_code, dir] of Object.entries(this.dir_desc)) {
        current_dirs[dir] = this.entity.game.get_key(key_code);
      }

      this.handle_keys(tick_length, current_dirs);
    }

    if (this.mouse_controlled && this.entity.game) {
      this.handle_mouse(tick_length, this.entity.game.mouse_delta);
    }
  }
}

const default_options$7 = {
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

const default_options = {
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

const EVENTS = ["keydown", "keyup", "mousemove"];

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

    for (const event_name of EVENTS) {
      const handler_name = "on" + event_name;
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
    const color_vec = hex_to_rgb(hex);

    gl.clearColor(
      color_vec[0],
      color_vec[1],
      color_vec[2],
      this.clear_opacity
    );
  }

  set clear_opacity(value) {
    this._clear_opacity = value;
    const color_vec = hex_to_rgb(this._clear_color);

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
    this.components = new WeakMap();
  }

  destroy() {
    for (const event_name of EVENTS) {
      window.removeEventListener(event_name, this[event_name]);
    }
  }

  emit(event_name, ...args) {
    if (this.listeners.has(event_name)) {
      for (const handler of this.listeners.get(event_name)) {
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
      const accumulated_delta = frame_time - this.last_tick;
      const ticks_qty = Math.floor(accumulated_delta / this.tick_delta);
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
    this.camera.components.get(Transform).get_view_matrix(this.viewMatrix);
  }

  render() {
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.viewport(0, 0, this.canvas.width, this.canvas.height);
    this.entities.forEach(entity => entity.render());
    this.emit('afterrender');
  }

  track_entity(entity) {
    entity.game = this;

    for (let component of entity.components.values()) {
      if (!this.components.has(component.constructor)) {
        this.components.set(component.constructor, new Set());
      }
      this.components.get(component.constructor).add(component);
    }

    // Recursively track children.
    for (let child of entity.entities) {
      this.track_entity(child);
    }
  }

  untrack_entity(entity) {
    entity.game = null;

    for (let component of entity.components.values()) {
      this.components.get(component.constructor).delete(component);
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
      const bound = (tick) => {
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
// vec3 fp; // vertex position
// vec3[MAX_LIGHTS] lp; // light position
// vec3[MAX_LIGHTS] lc; // light color
// float[MAX_LIGHTS] li; // light intensity
// int al; // active lights
// vec3 fn; // vertex normals
// vec2 v_t; // texture coordinates
// sampler2D u_t; //texture
// sampler2D n_m; // normal map

function fragment(defines) {
  return `#version 300 es

    ${defines.map(def => `
      #define ${def}
    `).join('')}

    precision mediump float;

    uniform vec4 c;

    in vec3 fp;

    #ifdef LIGHTS
      #define MAX_LIGHTS 100

      uniform vec3[MAX_LIGHTS] lp;
      uniform vec3[MAX_LIGHTS] lc;
      uniform float[MAX_LIGHTS] li;
      uniform int al;

      in vec3 fn;
    #endif

    #ifdef FOG
      uniform vec3 fog_color;
      uniform vec2 fog_distance;
      in float f_distance;
    #endif

    out vec4 frag_color;

    void main()
    {
      #ifdef FOG
        float fog_factor = clamp((fog_distance.y - f_distance) / (fog_distance.y - fog_distance.x), 0.0, 1.0);
      #endif

      #ifdef LIGHTS
          vec4 p_c = c;

          vec3 n = fn;

        vec4 light = vec4(0.0, 0.0, 0.0, 1.0);
        for (int i = 0; i < al; i++) {
          vec3 light_dir = lp[i] - fp;
          vec3 L = normalize(light_dir);
          float light_dist = length(light_dir);
          float diffuse_factor = max(dot(n, L), 0.0);
          vec3 rgb = p_c.rgb * diffuse_factor * lc[i] * li[i] / light_dist;
          light += vec4(rgb, p_c.a);
        }

        #ifdef FOG
          frag_color = mix(vec4(fog_color, 1.0), light, fog_factor);
        #else
          frag_color = light;
        #endif
      #else
          #ifdef FOG
            frag_color = mix(vec4(fog_color, 1.0), c, fog_factor);
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
// vec3 P_current; // current frame vertex position
// float frame_delta;
// vec3 P_next; // next frame vertex position
// vec3 N_next; // next frame normal
// vec3 N_current; // current frame normal
// vec3 fn; // output normal
// vec2 a_t; // texture coordinates
// vec2 v_t; // texture coordinates output

function vertex(defines) {
  return `#version 300 es

    ${defines.map(def => `
      #define ${def}
    `).join('')}

    precision mediump float;

    uniform mat4 p;
    uniform mat4 v;
    uniform mat4 w;

    in vec3 P_current;

    #ifdef LIGHTS
      in vec3 N_current;
      out vec3 fn;
    #endif

    #ifdef FOG
      uniform vec3 camera;
      out float f_distance;
    #endif

    out vec3 fp;

    void main()
    {

        fp = (w * vec4(P_current, 1.0)).xyz;

        #ifdef LIGHTS
          fn = (vec4(N_current, 0.0)).xyz;
        #endif

      gl_Position = p * v * vec4(fp, 1.0);

      #ifdef FOG
        f_distance = distance(w * vec4(P_current, 1.0), vec4(camera, 1.0));
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
    gl.uniformMatrix4fv(this.uniforms.p, gl.FALSE, game.projMatrix);
    gl.uniformMatrix4fv(this.uniforms.v, gl.FALSE, game.viewMatrix);

    gl.uniformMatrix4fv(
      this.uniforms.w,
      gl.FALSE,
      entity.components.get(Transform).world_matrix
    );

    gl.uniform4fv(
      this.uniforms.c,
      entity.components.get(Render).color_vec
    );

    this.apply_shader(entity, game);
  }
}

const base_seed = 19870306 * 6647088;

let seed = base_seed;



const rand = function() {
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
        this.size = 0.5;
    }
    mount() {
        this.transform = this.entity.components.get(Transform);
        this.buildings = window.bul = this.entity.game.buildings;
        this.last_position = this.transform.position;
    }

    is_colliding() {
        const { position } = this.transform;
        return this.buildings.some((building) => {
            if (position[0] + this.size >= building[0] &&
                position[0] - this.size <= building[1] &&
                position[2] + this.size >= building[2] &&
                position[2] - this.size <= building[3]) {
                return true;
            }
            return false;
        });
    }
    update(delta) {
        this.tick++;

        if (this.is_colliding()) {
            this.transform.position = this.last_position;
        } else {
            if (this.tick % 10 === 0) {
                this.last_position = this.transform.position;
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
            this.entity.components.get(Light).set(values);
        }
    }

    on() {
        this.active = true;
        let {color, intensity} = this;
        this.entity.add_component(new Light({
            color, intensity
        }));
        // this.entity.add_component(this.gizmo);
    }

    off() {
        this.active = false;
        this.entity.remove_component(Light);
        // this.entity.remove_component(Object.getPrototypeOf(this.gizmo));
    }
}

// 1 vox = this many units/meters
const SCALE = 4;
const CLEAR_COLOR = "333";

const WIREFRAME_COLOR = "888";

const BUILDING_COLOR = "222";
const BUILDING_FOG_MIN = 0;
const BUILDING_FOG_MAX = 40;

const NEON_FOG_MIN = 25;
const NEON_FOG_MAX = 100;
const NEON_LIGHT_MOUNT = 2;
const NEON_INTENSITY = 10;
const NEON_SCALE = 0.8;

const POWERUP_COLOR = "fff";
const POWERUP_INTENSITY = 5;

const LIGHT_DISTANCE = 30;

const HUE_MIN = -.09;
const HUE_MAX = .55;
const SATURATION = .9;
const LUMINANCE = .6;

class EnergySaver extends Component$1 {
    update() {
        let transform = this.entity.components.get(Transform);
        let position = transform.world_matrix.slice(12, 15);

        let lights = this.entity.game.components.get(NearbyLight);
        for (let light of lights) {
            let light_transform = light.entity.components.get(Transform);
            let light_position = light_transform.world_matrix.slice(12, 15);
            let dist = distance(position, light_position);

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
        this.transform = this.entity.components.get(Transform);
    }

    contains(world_point) {
        // Point in self space.
        let point = zero.slice();
        transformMat4(
            point, world_point, this.transform.world_to_self);
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
        this.transform = this.entity.components.get(Transform);
    }

    update() {
        let collidables = this.entity.game.components.get(Trigger);
        for (let trigger of collidables) {
            if (trigger.contains(this.transform.position)) {
                trigger.trigger();
            }
        }
    }
}

const vertices = [
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

const indices = [
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

const normals = [
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

const uvs = [
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
        this.transform = this.entity.components.get(Transform);
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
      ['p', 'v', 'w', 'c', 'frame_delta', 'fog_color', 'fog_distance', 'camera'],
      ['P_current', 'P_next', 'a_t']
    );
  }

  apply_shader(entity, game) {
    const render = entity.components.get(Render);
    let buffers = render.buffers;

    if (render.material.has_feature('FOG')) {
      gl.uniform3fv(this.uniforms.fog_color, this.fog.color);
      gl.uniform2fv(this.uniforms.fog_distance, this.fog.distance);
      gl.uniform3fv(this.uniforms.camera, game.camera.components.get(Transform).position);
    }

    // current frame
    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.vertices);
    gl.vertexAttribPointer(
      this.attribs.P_current,
      3, gl.FLOAT, gl.FALSE,
      0, 0
    );

    gl.enableVertexAttribArray(this.attribs.P_current);

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
      ['p', 'v', 'w', 'lp', 'li', 'lc', 'al', 'c', 'u_t', 'n_m', 'frame_delta', 'fog_color', 'fog_distance', 'camera'],
      ['P_current', 'P_next', 'N_current', 'N_next', 'a_t']
    );
  }

  apply_shader(entity, game) {
    const render = entity.components.get(Render);
    let buffers = render.buffers;

    if (render.material.has_feature('FOG')) {
      gl.uniform3fv(this.uniforms.fog_color, this.fog.color);
      gl.uniform2fv(this.uniforms.fog_distance, this.fog.distance);
      gl.uniform3fv(this.uniforms.camera, game.camera.components.get(Transform).position);
    }

    // current frame
    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.vertices);
    gl.vertexAttribPointer(
      this.attribs.P_current,
      3, gl.FLOAT, gl.FALSE,
      0, 0
    );

    gl.enableVertexAttribArray(this.attribs.P_current);

    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.normals);
    gl.vertexAttribPointer(
      this.attribs.N_current,
      3, gl.FLOAT, gl.FALSE,
      0, 0
    );
    gl.enableVertexAttribArray(this.attribs.N_current);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffers.indices);
    gl.drawElements(this.draw_mode, buffers.qty, gl.UNSIGNED_SHORT, 0);

    const lights = Array.from(game.components.get(Light));
    const lights_count = lights.length;
    let light_position = new Float32Array(lights_count * 3);
    let light_color = new Float32Array(lights_count * 3);
    let light_intensity = new Float32Array(lights_count);

    for (let i = 0; i < lights_count; i++) {
      let light_transform = lights[i].entity.components.get(Transform);
      let world_position = light_transform.world_matrix.slice(12, 15);
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

const BUILDING_TAG = 1;
const NEON_TAG = 2;
const POWERUP_TAG = 3;

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
    plane.components.get(Render).set({
        material: wireframe_material,
        color: WIREFRAME_COLOR,
        tag: BUILDING_TAG,
    });
    plane.components.get(Transform).set({
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
    neon.components.get(Render).set({
        material: wireframe_material,
        color,
        tag: NEON_TAG,
    });
    neon.components.get(Transform).set({
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
    building.components.get(Render).set({
        material: wireframe_material,
        color: WIREFRAME_COLOR,
        tag: BUILDING_TAG,
    });
    building.components.get(Transform).set({scale});
    group.add(building);

    for (let neon_opts of neons) {
        let neon = create_neon(neon_opts);
        group.add(neon);
    }

    return group;
}

function create_exit(options) {
    let exit = new Box();
    exit.components.get(Render).set({
        material: powerup_material,
        color: POWERUP_COLOR,
    });
    exit.components.get(Transform).set(options);
    exit.add_component(new Trigger({
        radius: 0.6,
        action: [EXIT]
    }));
    exit.add_component(new Rotator({
        speed: [0, 0.0001, 0],
    }));
    return exit;
}

function create_powerup({system, position}) {
    let cube = new Box();
    cube.components.get(Render).set({
        material: wireframe_material,
        color: POWERUP_COLOR,
        tag: POWERUP_TAG,
    });
    cube.components.get(Transform).set({position});
    cube.add_component(new Trigger({
        radius: 1,
        action: [ACTIVATE, system]
    }));
    cube.add_component(new Rotator({
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
		56,
		0,
		63,
		4,
		26
	],
	[
		46,
		0,
		54,
		3,
		37
	],
	[
		25,
		0,
		32,
		2,
		35
	],
	[
		17,
		0,
		23,
		6,
		39
	],
	[
		8,
		0,
		13,
		3,
		35
	],
	[
		0,
		0,
		8,
		12,
		30
	],
	[
		24,
		3,
		32,
		8,
		8
	],
	[
		35,
		4,
		42,
		7,
		32
	],
	[
		32,
		4,
		35,
		7,
		21
	],
	[
		60,
		5,
		63,
		13,
		23
	],
	[
		58,
		5,
		60,
		10,
		16
	],
	[
		46,
		5,
		58,
		8,
		6
	],
	[
		8,
		5,
		12,
		13,
		4
	],
	[
		42,
		6,
		46,
		11,
		8
	],
	[
		35,
		7,
		39,
		9,
		17
	],
	[
		21,
		8,
		27,
		12,
		7
	],
	[
		12,
		8,
		21,
		11,
		21
	],
	[
		48,
		12,
		54,
		18,
		28
	],
	[
		16,
		12,
		18,
		15,
		4
	],
	[
		0,
		12,
		5,
		16,
		13
	],
	[
		57,
		13,
		63,
		16,
		6
	],
	[
		44,
		13,
		46,
		20,
		18
	],
	[
		33,
		13,
		37,
		17,
		8
	],
	[
		11,
		13,
		14,
		16,
		16
	],
	[
		8,
		13,
		11,
		16,
		20
	],
	[
		42,
		14,
		44,
		17,
		15
	],
	[
		24,
		14,
		31,
		16,
		18
	],
	[
		60,
		16,
		63,
		24,
		32
	],
	[
		16,
		16,
		22,
		18,
		6
	],
	[
		11,
		16,
		14,
		19,
		12
	],
	[
		8,
		16,
		11,
		19,
		24
	],
	[
		0,
		16,
		4,
		24,
		21
	],
	[
		28,
		17,
		30,
		20,
		4
	],
	[
		24,
		17,
		27,
		23,
		8
	],
	[
		34,
		19,
		36,
		20,
		3
	],
	[
		17,
		19,
		22,
		21,
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
		23,
		3
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
		28,
		3
	],
	[
		17,
		21,
		22,
		24,
		18
	],
	[
		11,
		21,
		15,
		24,
		9
	],
	[
		4,
		21,
		9,
		27,
		3
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
		33,
		24,
		35,
		27,
		4
	],
	[
		24,
		24,
		28,
		28,
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
		60,
		26,
		63,
		31,
		26
	],
	[
		0,
		26,
		3,
		34,
		34
	],
	[
		51,
		27,
		54,
		30,
		17
	],
	[
		48,
		27,
		51,
		30,
		6
	],
	[
		4,
		27,
		6,
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
		5
	],
	[
		57,
		29,
		60,
		40,
		9
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
		6,
		31,
		10,
		34,
		4
	],
	[
		61,
		33,
		63,
		38,
		29
	],
	[
		21,
		33,
		23,
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
		28,
		34,
		31,
		39,
		17
	],
	[
		17,
		34,
		20,
		37,
		8
	],
	[
		8,
		34,
		13,
		38,
		10
	],
	[
		48,
		35,
		52,
		40,
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
		15,
		35,
		17,
		38,
		5
	],
	[
		0,
		36,
		8,
		39,
		28
	],
	[
		3,
		39,
		6,
		47,
		21
	],
	[
		54,
		40,
		63,
		43,
		20
	],
	[
		33,
		40,
		39,
		45,
		30
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
		19,
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
		47,
		41,
		51,
		44,
		15
	],
	[
		16,
		42,
		22,
		44,
		11
	],
	[
		55,
		43,
		63,
		46,
		11
	],
	[
		25,
		44,
		30,
		46,
		8
	],
	[
		52,
		46,
		56,
		52,
		5
	],
	[
		17,
		46,
		21,
		48,
		8
	],
	[
		9,
		46,
		13,
		58,
		10
	],
	[
		58,
		47,
		63,
		54,
		35
	],
	[
		45,
		47,
		50,
		52,
		31
	],
	[
		0,
		47,
		9,
		51,
		3
	],
	[
		34,
		49,
		41,
		52,
		5
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
		18,
		54,
		28
	],
	[
		20,
		51,
		24,
		54,
		19
	],
	[
		53,
		52,
		56,
		55,
		19
	],
	[
		34,
		52,
		43,
		55,
		23
	],
	[
		0,
		53,
		7,
		63,
		35
	],
	[
		44,
		54,
		53,
		58,
		9
	],
	[
		31,
		55,
		44,
		58,
		17
	],
	[
		57,
		56,
		63,
		63,
		28
	],
	[
		23,
		57,
		31,
		63,
		41
	],
	[
		9,
		58,
		23,
		61,
		17
	],
	[
		46,
		59,
		54,
		63,
		36
	],
	[
		34,
		60,
		42,
		63,
		38
	]
];
var start = [
	33,
	18
];
var end = [
	15,
	28
];
var items = [
	[
		"COMPASS",
		47,
		25
	],
	[
		"CLOCK",
		23,
		50
	],
	[
		"SOLID",
		48,
		45
	],
	[
		"COLOR",
		37,
		30
	],
	[
		"MOUSELOOK",
		32,
		26
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
    const game = new Game({
      width: window.innerWidth,
      height: window.innerHeight,
      far: 126,
      clear_color: CLEAR_COLOR,
    });

    game.buildings = [];

    game.perspe_matrix = JSON.parse(JSON.stringify(game.projMatrix));
    game.setup_ortho_camera();

    game.canvas.addEventListener(
        "click", () => document.body.requestPointerLock());

    game.camera.components.get(Transform).set({
        position: [
            map.start[0] * SCALE,
            1.75,
            map.start[1] * SCALE],
    });

    game.camera.remove_component(Move);

    const grid_move = new GridMove();
    game.camera.add_component(grid_move);

    grid_move.set({
        keyboard_controlled: true,
        mouse_controlled: false,
        move_speed: 5,
        rotate_speed: 0,
    });

    game.camera.add_component(new Actor());
    game.camera.add_component(new EnergySaver());

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
                const is_north_south = element_of([true, false]);
                const is_negative = element_of([1, -1]);
                const neon_height = (height * NEON_SCALE) / (arr.length + 0.5);
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
        game.buildings.push([center_x - xsize / 2, center_x + xsize / 2, center_z - zsize / 2, center_z + zsize/2]);
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
            for (let render of game.components.get(Render)) {
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
            for (let render of game.components.get(Render)) {
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
            game.camera.components.get(GridMove).set({
                mouse_controlled: true,
                rotate_speed: .5,
            });
            break;
        default:
            break;
    }
}

const init = {
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
const {attach, connect, dispatch: dispatch$1, html} =
    //createStore(with_logger(reducer));
    createStore(reducer);

function digest(text) {
    return [...text]
        .map(ch => ch.codePointAt(0))
        .reduce((acc, cur) => acc + cur, 0);
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

function set_glitch(line, text) {
    for (let glitchPart of line.querySelectorAll(".g > div")) {
        glitchPart.textContent = text;
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
const intro = `
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
const outro = `\
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

const formatters = [
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

function Compass(cls, styles) {
    return new class extends Component {
        before() {
            game.off("afterrender", this.up);
        }

        after(root) {
            let container = root.querySelector(`.${cls}`);
            this.up = game.on("afterrender", () => {
                let forward = game.camera.components.get(Transform).forward;
                let sign = forward[0] > 0 ? -1 : 1;
                let start = Math.round(angle([0, 0, 1], forward) / step) * sign;
                let section = (compass + compass + compass).slice(compass_length + start, compass_length + start + visible_characters);
                set_glitch(container, section);
            });
        }

        render() {
            return Block(
                cls,
                ["----"],
                styles
            );
        }
    }
}

function Matrix(cls, styles) {
    return new class extends Component {
        constructor() {
            super();
            this.nf = new Intl.NumberFormat("en", {
                minimumFractionDigits: 3,
                maximumFractionDigits: 3
            });
        }

        before() {
            game.off("afterrender", this.up);
        }

        after(root) {
            let rows = Array.from(
                root.querySelectorAll(`.${cls} .l`)).slice(1);
            this.up = game.on("afterrender", () => {
                // Update local matrix display
                let matrix = game.camera.components.get(Transform).matrix;
                let values = [
                    [matrix[0], matrix[4], matrix[8], matrix[12]],
                    [matrix[1], matrix[5], matrix[9], matrix[13]],
                    [matrix[2], matrix[6], matrix[10], matrix[14]],
                    [matrix[3], matrix[7], matrix[11], matrix[15]]
                ];

                // Skip the header.
                for (let [i, line] of rows.entries()) {
                    set_glitch(
                        line,
                        values[i].map(n => this.nf.format(n)).join(" "));
                }
            });
        }

        render() {
            return Block(cls, [
                "Avatar entity matrix", "1", "2", "3", "4"
            ], styles);
        }
    }
}

class MatrixTween extends Tween {
  action() {
    for (let i = 0; i < this.from.length; i++) {
        this.object[i] = this.from[i] + this.current_step * (this.to[i] - this.from[i]);
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

                    ${systems[COMPASS] && Compass("tm", {
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
