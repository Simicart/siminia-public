export function rotateRight(_arr) {
    const arr = Object.assign([], _arr);
    let last = arr.pop();
    arr.unshift(last);
    return arr;
}