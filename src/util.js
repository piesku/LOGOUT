export function digest(text) {
    return [...text]
        .map(ch => ch.codePointAt(0))
        .reduce((acc, cur) => acc + cur, 0);
}

export function clamp(num, min, max) {
    return Math.min(max, Math.max(min, num));
}

export function map(num, in1, in2, out1, out2) {
    return out1 + (out2 - out1) * ((num - in1) / (in2 - in1));
}
