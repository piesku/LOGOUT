let EPSILON = 0.000001;

export function create() {
    return new DOMMatrix();
}

export function clone(m) {
    return new DOMMatrix(m);
}

export function set(m, values) {
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

export function multiply(a, b) {
    return a.multiply(b);
}

export function invert(m) {
    return m.inverse();
}

export function ortho(out, left, right, bottom, top, near, far) {
    let lr = 1 / (left - right);
    let bt = 1 / (bottom - top);
    let nf = 1 / (near - far);
    return set(out, [
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

export function perspective(out, fovy, aspect, near, far) {
    let f = 1.0 / Math.tan(fovy / 2), nf;
    set(out, [
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

export function look_at(out, eye, center, up) {
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

    return set(out, [
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

export function get_scaling(out, mat) {
    out[0] = Math.sqrt(mat.m11 * mat.m11 + mat.m12 * mat.m12 + mat.m13 * mat.m13);
    out[1] = Math.sqrt(mat.m21 * mat.m21 + mat.m22 * mat.m22 + mat.m23 * mat.m23);
    out[2] = Math.sqrt(mat.m31 * mat.m31 + mat.m32 * mat.m32 + mat.m33 * mat.m33);

    return out;
}

export function compose(out, q, v, s) {
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

    return set(out, [
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
