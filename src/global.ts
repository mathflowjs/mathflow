import { toDegrees, toRadians } from './helpers';

/**
 * Supported operators
 */
export enum Operator {
    ADD = '+',
    SUB = '-',
    MUL = '*',
    DIV = '/'
}

/**
 * Dictionary of reserved identifiers
 * key - Multi-character keys
 * value - computation function
 */
export const KEYWORDS: Record<string, (x: number) => number> = {
    exp: (x) => Math.exp(x),
    log: (x) => Math.log10(x),
    ln: (x) => Math.log(x),
    deg: (x) => toDegrees(x),
    rad: (x) => toRadians(x),
    sin: (x) => Math.sin(toRadians(x)),
    cos: (x) => Math.cos(toRadians(x)),
    tan: (x) => Math.tan(toRadians(x)),
    asin: (x) => toDegrees(Math.asin(x)),
    acos: (x) => toDegrees(Math.acos(x)),
    atan: (x) => toDegrees(Math.atan(x)),
    sqrt: (x) => Math.sqrt(x)
};

/**
 * Default value for variables
 */
export const DEFAULT_VALUE = 0;
