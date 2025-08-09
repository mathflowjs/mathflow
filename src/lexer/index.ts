import { Context } from '../context';
import { createError, ERRORS } from '../error';
import {
    isDigit,
    isAlpha,
    isBinaryOperator,
    isWhitespace,
    TOKEN,
    type Token,
    SYMBOL
} from './tokens';

function createParenStack() {
    const values: boolean[] = [];
    return {
        get active() {
            return !!values.at(-1);
        },
        push() {
            values.push(true);
        },
        pop() {
            return values.pop();
        }
    };
}

/**
 * Break down an expression into a list of identified tokens
 */
export function tokenize(ctx: Context, code: string): Token[] {
    let position = 0;
    let line = 1;
    let column = 1;
    let char: string;
    const parenStack = createParenStack();
    const tokens: Token[] = [];

    // remove all comments
    code += SYMBOL.NEWLINE
    code = code.replace(/\n\s*#.*\n/g, "\n\n")
    code = code.replace(/\s*#.*\n/g, "\n")

    function isFunction(id: string) {
        return ctx.functions.has(id);
    }

    function advance(stage: string) {
        if (code[position] === SYMBOL.NEWLINE) {
            line++;
            column = 1;
        } else {
            column++;
        }
        position++;
        stage.slice();
        // console.log(stage, position - 1, 'next', position);
    }

    function addToken(type: TOKEN, value: string) {
        tokens.push({
            type,
            value,
            position,
            line,
            column
        });
    }

    function extractNumber(): string {
        let num = '';
        let hasDot = false;
        let hasExponent = false;
        let x = '';

        while (position < code.length) {
            x = code[position];
            if (isDigit(x)) {
                num += x;
                advance('num');
            } else if (
                x === SYMBOL.DOT &&
                !hasDot &&
                !hasExponent &&
                !!num.length
            ) {
                hasDot = true;
                num += x;
                advance('num');
            } else if (
                x.toLowerCase() === SYMBOL.EXPONENT &&
                !hasExponent &&
                !!num.length
            ) {
                hasExponent = true;
                num += x;
                advance('num');
            } else {
                break;
            }
        }

        if (num.endsWith(SYMBOL.DOT) || num.endsWith(SYMBOL.EXPONENT)) {
            throw createError(
                ERRORS.LEXICAL,
                `unexpected token '${x}' at ${line}:${column}`
            );
        }

        return num;
    }

    function extractString(): string {
        let str = '';
        let hasChar = false;

        while (position < code.length) {
            const c = code[position];
            if (isAlpha(c) || (hasChar && isDigit(c))) {
                hasChar = true;
                str += c;
                advance('identifier');
            } else {
                break;
            }
        }

        return str;
    }

    function expandImplicitMultiplication() {
        if (position >= code.length) return;

        const prev = tokens.at(-2);
        const curr = tokens.at(-1);
        if (!prev || !curr) return;

        let expand = false;

        // expand: 2x
        if (prev.type === TOKEN.NUMBER && curr.type === TOKEN.IDENTIFIER) {
            expand = true;
        }
        // expand: 2(x+1)
        else if (prev.type === TOKEN.NUMBER && curr.type === TOKEN.LPAREN) {
            expand = true;
        }
        // expand: (x+1)y or (x+1)2
        else if (
            prev.type === TOKEN.RPAREN &&
            (curr.type === TOKEN.IDENTIFIER || curr.type === TOKEN.NUMBER)
        ) {
            expand = true;
        }
        // expand: x(x+1) - not function call
        else if (
            prev.type === TOKEN.IDENTIFIER &&
            curr.type === TOKEN.LPAREN &&
            !isFunction(prev.value)
        ) {
            expand = true;
        }
        // expand: (x+1)(x+2)
        else if (prev.type === TOKEN.RPAREN && curr.type === TOKEN.LPAREN) {
            expand = true;
        }

        if (!expand) return;

        tokens.splice(-1, 0, {
            type: TOKEN.OPERATOR,
            value: SYMBOL.MUL,
            line,
            column,
            position
        });
    }

    while (position < code.length) {
        char = code[position];

        if (isWhitespace(char)) {
            if (char === SYMBOL.NEWLINE) {
                addToken(TOKEN.NEWLINE, char);
            }
            advance('whitespace');
        } else if (char === SYMBOL.LPAREN) {
            parenStack.push();
            addToken(TOKEN.LPAREN, char);
            advance('lparen');
        } else if (char === SYMBOL.RPAREN && parenStack.active) {
            parenStack.pop();
            addToken(TOKEN.RPAREN, char);
            advance('rparen');
        } else if (char === SYMBOL.COMMA && parenStack.active) {
            addToken(TOKEN.COMMA, char);
            advance('comma');
        } else if (
            char === SYMBOL.EQUAL &&
            !parenStack.active &&
            !!tokens.length &&
            tokens.at(-1)?.type === TOKEN.IDENTIFIER
        ) {
            addToken(TOKEN.ASSIGNMENT, char);
            advance('assign');
        } else if (isBinaryOperator(char)) {
            addToken(TOKEN.OPERATOR, char);
            advance('operator');
        } else if (isDigit(char)) {
            char = extractNumber();
            addToken(TOKEN.NUMBER, char);
        } else if (isAlpha(char)) {
            const id = extractString();
            if (isFunction(id)) {
                addToken(TOKEN.FUNCTION, id);
            } else {
                addToken(TOKEN.IDENTIFIER, id);
            }
        } else {
            throw createError(
                ERRORS.LEXICAL,
                `unexpected token '${char}' at ${line}:${column}`
            );
        }

        expandImplicitMultiplication();
    }

    // in case of missing right parenthesis
    if (parenStack.active) {
        throw createError(
            ERRORS.LEXICAL,
            `unexpected token at ${line}:${column}`,
            `expecting ')'`
        );
    }

    // end of file
    addToken(TOKEN.EOF, SYMBOL.EOF);

    return tokens;
}
