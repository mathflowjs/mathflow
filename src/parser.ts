import { Operator } from './global';
import { TokenType } from './lexer';
import type { Token } from './lexer';

export type NodeType =
    | TokenType.BinaryOperator
    | TokenType.Number
    | TokenType.Keyword
    | TokenType.Identifier;

export interface Node {
    [x: string]: any;
    type: NodeType;
}

export interface BinaryOperator extends Node {
    type: TokenType.BinaryOperator;
    left: Node;
    right: Node;
    operator: Operator;
}

export interface IdentifierNode extends Node {
    type: TokenType.Identifier;
    name: string;
}

export interface KeywordNode extends Node {
    type: TokenType.Keyword;
    name: string;
    argument: Node;
}

export interface NumericNode extends Node {
    type: TokenType.Number;
    value: string;
}

/**
 * Build an Abstract Syntax Tree (AST) from a list of tokens
 * - follows mathematical precedence of operators
 */
export function parse(tokens: Token[] = []): Node {
    let index = 0;

    // check for end of the file (last token)
    function isEOF() {
        return tokens[index].type === TokenType.EOF;
    }

    // check whether the current character matches the provided types
    function isType(...types: TokenType[]): boolean {
        return types.includes(tokens[index].type);
    }

    // Handle an atomic expression on one side of a binary operator
    function parseFactor(): Node {
        if (!isEOF() && isType(TokenType.OpenParen)) {
            index++;
            const result = parseNode();
            index++;
            return result;
        } else if (isType(TokenType.Number)) {
            return tokens[index++] as NumericNode;
        } else if (isType(TokenType.Identifier, TokenType.Keyword)) {
            const { type, value: name } = tokens[index++];
            if (type === TokenType.Keyword) {
                index++;
                const argument = parseNode();
                index++;
                return { type, name, argument } as KeywordNode;
            }
            return { type, name } as IdentifierNode;
        } else {
            throw new Error(`Unexpected token: ${tokens[index].value}`);
        }
    }

    // Parse expressions on both sides of the binary operators (* and /)
    function parseTerm(): Node {
        let result = parseFactor();
        while (
            !isEOF() &&
            (tokens[index].value === Operator.MUL ||
                tokens[index].value === Operator.DIV)
        ) {
            const operator = tokens[index].value;
            index++;
            const factor = parseFactor();
            result = {
                type: TokenType.BinaryOperator,
                operator,
                left: result,
                right: factor
            } as BinaryOperator;
        }
        return result;
    }

    // Parse expressions on both sides of the binary operators (+ and -) first
    function parseNode(): Node {
        let result = parseTerm();
        while (
            !isEOF() &&
            (tokens[index].value === Operator.ADD ||
                tokens[index].value === Operator.SUB)
        ) {
            const operator = tokens[index].value;
            index++;
            const term = parseTerm();
            result = {
                type: TokenType.BinaryOperator,
                operator,
                left: result,
                right: term
            } as BinaryOperator;
        }
        return result;
    }

    return parseNode();
}
