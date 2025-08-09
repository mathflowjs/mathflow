export enum SYMBOL {
    COMMENT = '#',
    NEWLINE = '\n',
    LPAREN = '(',
    RPAREN = ')',
    COMMA = ',',
    DOT = '.',
    EXPONENT = 'e',
    ADD = '+',
    SUB = '-',
    MUL = '*',
    DIV = '/',
    POW = '^',
    EQUAL = '=',
    EOF = 'EOF'
}

export enum TOKEN {
    // numbers
    NUMBER = 'NUM',

    // identifiers - constants & user defined variables
    IDENTIFIER = 'IDENT',

    // operators - unary & binary
    OPERATOR = 'OP',

    // assignment expressions
    ASSIGNMENT = 'ASSIGN',

    // parenthesis
    LPAREN = 'LPAREN',
    RPAREN = 'RPAREN',

    // builtin functions
    FUNCTION = 'FUNC',

    // special
    COMMA = 'COMMA',
    NEWLINE = 'NEWLINE',
    EOF = 'EOF'
}

export interface Token<T = TOKEN> {
    type: T;
    value: string;
    position: number;
    line: number;
    column: number;
    implicit?: boolean;
}

/**
 * Check if the character `char` is a whitespace or skippable
 */
export function isWhitespace(char: string): boolean {
    return /^\s$/.test(char);
}

/**
 * Check if the character `char` is a unary operator
 */
export function isUnaryOperator(char: string): boolean {
    return /^[+-]$/.test(char);
}

/**
 * Check if the character `char` is a binary operator
 */
export function isBinaryOperator(char: string): boolean {
    return isUnaryOperator(char) || /^[*/^]$/.test(char);
}

/**
 * Check if the character `char` is a number
 */
export function isDigit(char: string): boolean {
    return /^\d$/.test(char);
}

/**
 * Check if the character `char` is alphabetic
 */
export function isAlpha(char: string): boolean {
    return /^[a-zA-Z]$/.test(char);
}
