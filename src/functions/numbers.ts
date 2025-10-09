export default function initNumbers() {
    return {
        add: (...x: number[]) => x.reduce((s, c) => s + c, 0),
        sub: (x: number, y: number) => x - y,
        mul: (...x: number[]) => x.reduce((s, c) => s * c, 1),
        div: (x: number, y: number) => x / y,
        mod: (x: number, y: number) => x % y,
        abs: (x: number) => Math.abs(x),
        ceil: (x: number) => Math.ceil(x),
        floor: (x: number) => Math.floor(x),
        sqrt: (x: number) => Math.sqrt(x),
        pow: (x: number, y: number) => Math.pow(x, y),
        cbrt: (x: number) => Math.pow(x, 1 / 3),
        root: (x: number, y: number) => Math.pow(x, 1 / y),
        trunc: (x: number) => Math.trunc(x)
    };
}
