export default function initLogarithms() {
    return {
        exp: (x: number) => Math.exp(x),
        ln: (x: number) => Math.log(x),
        log: (x: number, y = 10) => Math.log10(x) / Math.log10(y),
        log10: (x: number) => Math.log10(x),
        log2: (x: number) => Math.log2(x)
    };
}
