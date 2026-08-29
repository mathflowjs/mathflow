import { NODE, type INode } from '../parser';
import { SYMBOL } from '../lexer/tokens';

/**
 * Operator precedence, used to decide where parentheses are required.
 * Unary sits between `* /` and `^`: `-2^2` is `-(2^2)`, but `-2*3` is `(-2)*3`.
 */
const PRECEDENCE: Record<string, number> = {
    '+': 1,
    '-': 1,
    '*': 2,
    '/': 2,
    '^': 4
};

const UNARY = 3;
const ATOM = 5;

function precedence(node: INode): number {
    if (node.type === NODE.BINARY) return PRECEDENCE[node.value] ?? ATOM;
    if (node.type === NODE.UNARY) return UNARY;
    return ATOM;
}

/**
 * A reduced literal can hold a negative value; `2 - -7` is valid but reads
 * badly, and `-7 ^ 2` would parse back as `-(7 ^ 2)`.
 */
function isNegative(node: INode): boolean {
    return node.type === NODE.LITERAL && node.value.startsWith('-');
}

/**
 * Render an operand, parenthesizing it only when precedence or associativity
 * demands it - `^` is right-associative, every other operator is left.
 */
function operand(
    node: INode,
    parent: number,
    isRight = false,
    rightAssoc = false
): string {
    const child = precedence(node);

    const parens =
        child < parent ||
        (child === parent && isRight !== rightAssoc) ||
        (isNegative(node) && (isRight || parent >= UNARY));

    const text = stringify(node);

    return parens ? `(${text})` : text;
}

/**
 * Render an AST node as the mathematical notation it came from
 */
export function stringify(node: INode): string {
    switch (node.type) {
        case NODE.UNARY:
            return node.value + operand(node.right!, UNARY);

        case NODE.BINARY: {
            const parent = PRECEDENCE[node.value] ?? ATOM;
            const rightAssoc = node.value === SYMBOL.POW;

            return [
                operand(node.left!, parent, false, rightAssoc),
                node.value,
                operand(node.right!, parent, true, rightAssoc)
            ].join(' ');
        }

        case NODE.CALL:
            return `${node.value}(${node.arguments!.map(stringify).join(', ')})`;

        case NODE.ASSIGNMENT:
            return `${node.left!.value} = ${stringify(node.right!)}`;

        default:
            return node.value;
    }
}
