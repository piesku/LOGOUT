export function digest(text) {
    return [...text]
        .map(ch => ch.codePointAt(0))
        .reduce((acc, cur) => acc + cur, 0);
}
