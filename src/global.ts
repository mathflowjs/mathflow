import * as fns from './functions/index';

/**
 * Supported operators
 */
export enum Operator {
    ADD = '+',
    SUB = '-',
    MUL = '*',
    DIV = '/',
    POW = '^'
}

/**
 * Reserved function identifiers
 * key - Multi-character keys
 * value - computation function
 */
export const FUNCTIONS: Record<string, (...x: number[]) => number> = fns;

/**
 * Reserved variable identifiers
 */
export const CONSTANTS: Record<string, number> = {
    pi: Math.PI,
    e: Math.E
};

/**
 * Default value for variables
 */
export const DEFAULT_VALUE = 0;

/**
 * Output configuration
 */
export const config = {
    /**
     * Number of digits after the decimal point (min - 0, max - 20)
     */
    fractionDigits: 4
};
