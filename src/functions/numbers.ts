export const abs = (x: number) => Math.abs(x);
export const ceil = (x: number) => Math.ceil(x);
export const floor = (x: number) => Math.floor(x);
export const sign = (x: number) => (x > 0 ? 1 : 0);
export const sqrt = (x: number) => Math.sqrt(x);
export const cbrt = (x: number) => Math.pow(x, 1 / 3);
export const trunc = (x: number) => Math.trunc(x);

export const add = (...x: number[]) => x.reduce((s, c) => s + c, 0);
