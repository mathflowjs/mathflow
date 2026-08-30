import { type IContext } from '../context';
import { createError, ERRORS } from '../error';
import {
    isDigit,
    isAlpha,
    isBinaryOperator,
    isUnaryOperator,
    isWhitespace,
    TOKEN,
    type IToken,
    SYMBOL
} from './tokens';

/**
 * Break down an expression into a list of identified tokens
 */
export function tokenize(ctx: IContext, code: string): IToken[] {
    let position = 0;
    let line = 1;
    let column = 1;
    let char: string;
    let depth = 0;
    const tokens: IToken[] = [];

    // remove all comments
    code += SYMBOL.NEWLINE;
    code = code.replace(/\n\s*#.*\n/g, '\n\n');
    code = code.replace(/\s*#.*\n/g, '\n');

    function isFunction(id: string) {
        return ctx.functions.has(id);
    }

    function advance() {
        if (code[position] === SYMBOL.NEWLINE) {
            line++;
            column = 1;
        } else {
            column++;
        }
        position++;
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
                advance();
            } else if (
                x === SYMBOL.DOT &&
                !hasDot &&
                !hasExponent &&
                !!num.length
            ) {
                hasDot = true;
                num += x;
                advance();
            } else if (
                x.toLowerCase() === SYMBOL.EXPONENT &&
                !hasExponent &&
                !!num.length
            ) {
                // an exponent only if digits follow, optionally signed -
                // anything else is the constant `e`, as in `2e`
                const signed = isUnaryOperator(code[position + 1]) ? 1 : 0;
                if (!isDigit(code[position + 1 + signed])) break;

                hasExponent = true;
                num += x;
                advance();

                if (signed) {
                    num += code[position];
                    advance();
                }
            } else {
                break;
            }
        }

        if (num.endsWith(SYMBOL.DOT)) {
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
                advance();
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

        const expand = [
            // )2
            // )x
            // )sin
            // )(
            prev.type === TOKEN.RPAREN &&
                [
                    TOKEN.IDENTIFIER,
                    TOKEN.FUNCTION,
                    TOKEN.NUMBER,
                    TOKEN.LPAREN
                ].includes(curr.type),

            // 2sin
            // 2x
            // 2(
            prev.type === TOKEN.NUMBER &&
                [TOKEN.LPAREN, TOKEN.IDENTIFIER, TOKEN.FUNCTION].includes(
                    curr.type
                ),

            // x(
            prev.type === TOKEN.IDENTIFIER && curr.type === TOKEN.LPAREN
        ].some((x) => !!x);

        if (!expand) return;

        tokens.splice(-1, 0, {
            type: TOKEN.OPERATOR,
            value: SYMBOL.MUL,
            line,
            column,
            position,
            implicit: true
        });
    }

    while (position < code.length) {
        char = code[position];

        if (isWhitespace(char)) {
            if (char === SYMBOL.NEWLINE) {
                addToken(TOKEN.NEWLINE, char);
            }
            advance();
        } else if (char === SYMBOL.LPAREN) {
            depth++;
            addToken(TOKEN.LPAREN, char);
            advance();
        } else if (char === SYMBOL.RPAREN && depth > 0) {
            depth--;
            addToken(TOKEN.RPAREN, char);
            advance();
        } else if (char === SYMBOL.COMMA && depth > 0) {
            addToken(TOKEN.COMMA, char);
            advance();
        } else if (
            char === SYMBOL.EQUAL &&
            depth === 0 &&
            !!tokens.length &&
            tokens.at(-1)?.type === TOKEN.IDENTIFIER
        ) {
            addToken(TOKEN.ASSIGNMENT, char);
            advance();
        } else if (isBinaryOperator(char)) {
            addToken(TOKEN.OPERATOR, char);
            advance();
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
    if (depth > 0) {
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
