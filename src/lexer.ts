import { FUNCTIONS, CONSTANTS } from './global';
import { matchValue } from './helpers';

export enum TokenType {
    Number,

    UnaryOperator,
    BinaryOperator,

    OpenParen,
    ClosedParen,

    Identifier,

    Constant,
    Function,

    EOF
}

export type Token = {
    value: string;
    type: TokenType;
};

/**
 * Create a token object from `value` and `type`
 */
function createToken(value = '', type: TokenType): Token {
    return { value, type };
}

/**
 * Check if the character `char` is a unary operator
 */
function isUnaryOperator(char: string): boolean {
    return /^[+-]$/.test(char);
}

/**
 * Check if the character `char` is a binary operator
 */
export function isBinaryOperator(char: string): boolean {
    return isUnaryOperator(char) || /^[*/^]$/.test(char);
}

/**
 * Check if the character `char` is alphabetic
 */
export function isAlpha(char: string): boolean {
    return /^[a-z]$/i.test(char);
}

/**
 * Check if the character `char` is a number
 */
function isInt(char: string): boolean {
    return /^\d$/.test(char);
}

/**
 * Check if the character `char` is a ignorable or irrelevant
 */
function isSkippable(char: string): boolean {
    return /^\s$/.test(char);
}

/**
 * Break down an expression into a list of identified tokens
 */
export function tokenize(expr: string): Token[] {
    const tokens = new Array<Token>();
    let index = 0;
    let openParen = false;
    let sign = '';

    function extractNumber(): string {
        // build a multiple digit number with floating points if any
        let num = '';
        while (
            index < expr.length &&
            (isInt(expr[index]) ||
                (expr[index] === '.' && isInt(expr[index + 1])))
        ) {
            num += expr[index];
            index++;
        }
        return num;
    }

    function extractString(): string {
        let str = '';
        let hasChar = false;
        while (index < expr.length) {
            if (isAlpha(expr[index]) || (hasChar && isInt(expr[index]))) {
                hasChar = true;
                str += expr[index];
                index++;
            } else {
                break;
            }
        }
        return str;
    }

    while (index < expr.length) {
        if (expr[index] === '(') {
            openParen = true;
            tokens.push(createToken(expr[index++], TokenType.OpenParen));
        } else if (expr[index] === ')') {
            openParen = false;
            tokens.push(createToken(expr[index++], TokenType.ClosedParen));
        } else if (isBinaryOperator(expr[index])) {
            // capture operator's sign incase of unary operator - signed number
            if (
                isUnaryOperator(expr[index]) &&
                (!tokens.at(-1) ||
                    matchValue(
                        tokens.at(-1)?.type,
                        TokenType.BinaryOperator,
                        TokenType.OpenParen
                    ))
            ) {
                sign = expr[index++];
            } else {
                // otherwise take it as a normal binary operator
                tokens.push(
                    createToken(expr[index++], TokenType.BinaryOperator)
                );
            }
        } else if (isInt(expr[index])) {
            // build a number with all digits
            const num = extractNumber();
            // incase this is a signed number
            tokens.push(createToken(sign + num, TokenType.Number));
            // reset the sign
            if (sign) {
                sign = '';
            }
        } else if (isAlpha(expr[index])) {
            // build a multicharacter indentifier
            const identifier = extractString();

            // built-in function
            if (FUNCTIONS[identifier]) {
                tokens.push(createToken(identifier, TokenType.Function));
            }
            // built-in constant
            else if (CONSTANTS[identifier]) {
                tokens.push(createToken(identifier, TokenType.Constant));
            }
            // user defined variable
            else {
                tokens.push(createToken(identifier, TokenType.Identifier));
            }
        } else if (isSkippable(expr[index])) {
            // ignore irrelevant characters
            index++;
        } else {
            // unsupported character
            throw new Error(
                "Unexpected character '" +
                    expr[index] +
                    "' near " +
                    expr.slice(0, Math.max(0, index))
            );
        }
    }

    // incase there is no closing bracket
    if (openParen) {
        throw new Error('Unexpected end of expression: ' + expr);
    }

    // track the end of the script with End-Of-File token
    tokens.push(createToken('EOF', TokenType.EOF));

    return tokens;
}
