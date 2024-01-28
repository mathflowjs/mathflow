import { Operator } from './global';
import { matchValue } from './helpers';
import { TokenType } from './lexer';
import type { Token } from './lexer';

export type NodeType =
    | TokenType.BinaryOperator
    | TokenType.Number
    | TokenType.Constant
    | TokenType.Function
    | TokenType.Identifier;

export interface Node {
    // [x: string]: unknown;
    type: NodeType;
    left?: Node;
    right?: Node;
    operator?: Operator;
    name?: string;
    argument?: Node;
    value?: string;
}

/**
 * Build an Abstract Syntax Tree (AST) from a list of tokens
 * - follows mathematical precedence of operators
 */
export function parse(tokens: Token[] = []): Node {
    let index = 0;

    // check for end of the script (last token)
    function isEOF() {
        return tokens[index].type === TokenType.EOF;
    }

    // Handle an atomic expression on one side of a binary operator
    function parseFactor(): Node {
        if (!isEOF() && matchValue(tokens[index]?.type, TokenType.OpenParen)) {
            index++;
            const result = parseNode();
            index++;
            return result;
        } else if (matchValue(tokens[index]?.type, TokenType.Number)) {
            return tokens[index++] as Node;
        } else if (
            matchValue(
                tokens[index]?.type,
                TokenType.Identifier,
                TokenType.Constant,
                TokenType.Function
            )
        ) {
            const { type, value: name } = tokens[index++];
            if (type === TokenType.Function) {
                index++;
                const argument = parseNode();
                index++;
                return { type, name, argument };
            }
            return { type, name } as Node;
        } else {
            throw new Error(`Unexpected token: ${tokens[index].value}`);
        }
    }

    // Parse expressions on both sides of the binary operators (* and /)
    function parseTerm(): Node {
        let result = parseFactor();
        while (
            !isEOF() &&
            matchValue(
                tokens[index].value,
                Operator.MUL,
                Operator.DIV,
                Operator.POW
            )
        ) {
            const operator = tokens[index].value;
            index++;
            const factor = parseFactor();
            result = {
                type: TokenType.BinaryOperator,
                operator,
                left: result,
                right: factor
            } as Node;
        }
        return result;
    }

    // Parse expressions on both sides of the binary operators (+ and -) first
    function parseNode(): Node {
        let result = parseTerm();
        while (
            !isEOF() &&
            matchValue(tokens[index].value, Operator.ADD, Operator.SUB)
        ) {
            const operator = tokens[index].value;
            index++;
            const term = parseTerm();
            result = {
                type: TokenType.BinaryOperator,
                operator,
                left: result,
                right: term
            } as Node;
        }
        return result;
    }

    return parseNode();
}
