import { KEYWORDS } from './global';

export enum TokenType {
    Number,

    BinaryOperator,

    OpenParen,
    ClosedParen,

    Identifier,
    Keyword,

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
 * Check if the character `char` is a binary operator
 */
function isBinaryOperator(char: string): boolean {
    return /^[*+/^-]$/.test(char);
}

/**
 * Check if the character `char` is alphabetic
 */
function isAlpha(char: string): boolean {
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

    while (index < expr.length) {
        if (expr[index] === '(') {
            openParen = true;
            tokens.push(createToken(expr[index++], TokenType.OpenParen));
        } else if (expr[index] === ')') {
            openParen = false;
            tokens.push(createToken(expr[index++], TokenType.ClosedParen));
        } else if (isBinaryOperator(expr[index])) {
            tokens.push(createToken(expr[index++], TokenType.BinaryOperator));
        } else if (isInt(expr[index])) {
            // build a number with many digits
            let num = '';
            while (
                index < expr.length &&
                (isInt(expr[index]) ||
                    (expr[index] === '.' && isInt(expr[index + 1])))
            ) {
                num += expr[index];
                index++;
            }
            tokens.push(createToken(num, TokenType.Number));
        } else if (isAlpha(expr[index])) {
            // build a multicharacter indentifier
            let identifier = '';
            let hasChar = false;
            while (index < expr.length) {
                if (isAlpha(expr[index]) || (hasChar && isInt(expr[index]))) {
                    hasChar = true;
                    identifier += expr[index];
                    index++;
                } else {
                    break;
                }
            }
            // check if it a keyword or user variable
            if (KEYWORDS[identifier]) {
                tokens.push(createToken(identifier, TokenType.Keyword));
            } else {
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

    // track the end of the script with end of file token
    tokens.push(createToken('EOF', TokenType.EOF));

    return tokens;
}
