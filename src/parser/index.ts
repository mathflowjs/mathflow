import { createError, ERRORS } from '../error';
import { isUnaryOperator, SYMBOL, TOKEN, Token } from '../lexer/tokens';

export enum NODE {
    PROGRAM = 'Program',
    ASSIGNMENT = 'AssignmentExpression',
    BINARY = 'BinaryExpression',
    UNARY = 'UnaryExpression',
    CALL = 'CallExpression',
    IDENTIFIER = 'Indetifier',
    LITERAL = 'Literal'
}

export interface Node extends Token<NODE> {
    left?: Node;
    right?: Node;
    arguments?: Node[];
}

function createTokenStream(tokens: Token[]) {
    let current = 0;

    return {
        get isEOF() {
            return (
                (this.current && this.current.type === TOKEN.EOF) ||
                current >= tokens.length
            );
        },
        get current() {
            return tokens[current];
        },
        get previous() {
            return tokens[current - 1];
        },
        advance() {
            if (!this.isEOF) current++;
        }
    };
}

/**
 * Build an Abstract Syntax Tree (AST) from a list of tokens
 * - follows mathematical precedence of operators
 */
export function parse(tokens: Token[]) {
    const stream = createTokenStream(tokens);

    function check(type: TOKEN): boolean {
        if (stream.isEOF) return false;
        return stream.current.type === type;
    }

    // does current token match any given type
    function matchType(...types: TOKEN[]): boolean {
        for (const type of types) {
            if (check(type)) {
                stream.advance();
                return true;
            }
        }
        return false;
    }

    // does current token match any given value
    function matchValue(...values: string[]): boolean {
        if (!stream.isEOF && values.includes(stream.current?.value)) {
            stream.advance();
            return true;
        }
        return false;
    }

    // parse multiple line program
    function parseProgram() {
        const statements: Node[] = [];

        while (!stream.isEOF) {
            // skip newline characters at the start
            while (matchType(TOKEN.NEWLINE)) {
                /* noop */
            }
            if (stream.isEOF) break;

            const stmt = parseStatement();
            if (stmt) statements.push(stmt);

            // skip newline characters at the end
            while (matchType(TOKEN.NEWLINE)) {
                /* noop */
            }
        }

        return { type: NODE.PROGRAM, body: statements };
    }

    function parseStatement() {
        return parseAssignment();
    }

    // parse a single line or expression
    //
    // precendence / priority / order of execution
    //
    // 1. assignment expression
    // 2. addition and subtraction (lowest precendence)
    // 3. multiplication, division, exponential (highest precendence)
    // 4. unary, literals, identifiers, parentheses, function call expression

    function parseAssignment() {
        const node = parseExpression();

        if (matchType(TOKEN.ASSIGNMENT)) {
            const eq = stream.previous;

            if (node && node.type === NODE.IDENTIFIER) {
                const value = parseExpression();
                return {
                    ...eq,
                    type: NODE.ASSIGNMENT,
                    left: node,
                    right: value
                };
            }

            throw createError(
                ERRORS.SYNTAX,
                `invalid assignment at ${eq.line}:${eq.column}`
            );
        }

        return node;
    }

    // addition and subtraction
    function parseExpression() {
        let node = parseTerm();

        while (check(TOKEN.OPERATOR) && matchValue(SYMBOL.ADD, SYMBOL.SUB)) {
            const op = stream.previous;
            const factor = parseTerm();

            node = {
                ...op,
                type: NODE.BINARY,
                left: node,
                right: factor
            };
        }

        return node;
    }

    // multiplication and division
    function parseTerm() {
        let node = parsePower();

        while (
            !stream.isEOF &&
            check(TOKEN.OPERATOR) &&
            matchValue(SYMBOL.MUL, SYMBOL.DIV)
        ) {
            const op = stream.previous;
            const factor = parsePower();

            node = {
                ...op,
                type: NODE.BINARY,
                left: node,
                right: factor
            };
        }

        return node;
    }

    // power - exponential
    function parsePower() {
        const node = parseFactor();

        if (check(TOKEN.OPERATOR) && matchValue(SYMBOL.POW)) {
            const op = stream.previous;
            const factor = parseFactor();

            return {
                ...op,
                type: NODE.BINARY,
                left: node,
                right: factor
            };
        }

        return node;
    }

    // atomic values
    function parseFactor(): Node | undefined {
        // int or float
        if (matchType(TOKEN.NUMBER)) {
            return { ...stream.previous, type: NODE.LITERAL };
        }

        // variable or constant
        if (matchType(TOKEN.IDENTIFIER)) {
            return { ...stream.previous, type: NODE.IDENTIFIER };
        }

        // brackets
        if (matchType(TOKEN.LPAREN)) {
            const node = parseExpression();
            stream.advance();
            return node;
        }

        // unary +x or -3
        if (
            !stream.isEOF &&
            isUnaryOperator(stream.current.value) &&
            matchType(TOKEN.OPERATOR)
        ) {
            const node = stream.previous;
            const value = parseFactor();
            return {
                ...node,
                type: NODE.UNARY,
                right: value
            };
        }

        // function call
        if (matchType(TOKEN.FUNCTION) && stream.current.type === TOKEN.LPAREN) {
            const node = stream.previous;

            // extract arguments
            const args: Node[] = [];

            // skip (
            stream.advance();

            do {
                const arg = parseExpression();
                if (arg) args.push(arg);
            } while (!stream.isEOF && matchType(TOKEN.COMMA));

            // skip )
            stream.advance();

            return { ...node, type: NODE.CALL, arguments: args };
        }

        const nearestToken = stream.current || stream.previous;
        throw createError(
            ERRORS.SYNTAX,
            `unexpected token near '${nearestToken.value}' at ${nearestToken.line}:${nearestToken.column}`
        );
    }

    return parseProgram();
}
