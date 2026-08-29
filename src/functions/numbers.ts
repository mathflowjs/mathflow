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
        cbrt: (x: number) => Math.cbrt(x),
        root: (x: number, y: number) =>
            // an odd root of a negative number is real: root(-8, 3) is -2
            x < 0 && Number.isInteger(y) && y % 2 !== 0
                ? -Math.pow(-x, 1 / y)
                : Math.pow(x, 1 / y),
        trunc: (x: number) => Math.trunc(x)
    };
}
