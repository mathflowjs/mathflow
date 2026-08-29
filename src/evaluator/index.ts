import { type INode, NODE } from '../parser';
import { type IContext } from '../context';
import { createError, ERRORS } from '../error';
import { SYMBOL } from '../lexer/tokens';
import { stringify } from './solution';

export type IResult = {
    value: number;
    solution: string[];
};

function compute(op: SYMBOL, a: number, b: number): number {
    switch (op) {
        case SYMBOL.ADD:
            return a + b;
        case SYMBOL.SUB:
            return a - b;
        case SYMBOL.MUL:
            return a * b;
        case SYMBOL.DIV:
            return a / b;
        case SYMBOL.POW:
            return a ** b;
        default:
            throw createError(ERRORS.RUNTIME, `unknown operator: '${op}'`);
    }
}

/**
 * Apply the context's rounding preferences - this happens on every node, not
 * just the final result, so that each step of a solution adds up on its own.
 */
function toNumber(ctx: IContext, value: string | number): number {
    value = value.toString();
    if (ctx.preferences.precision && ctx.preferences.precision > 0) {
        value = Number(value).toPrecision(ctx.preferences.precision);
    }
    if (ctx.preferences.fractionDigits && ctx.preferences.fractionDigits > 0) {
        value = Number(value).toFixed(ctx.preferences.fractionDigits);
    }
    return Number.parseFloat(value);
}

/**
 * A computed value, as a node that can take the place of the sub-tree it came
 * from. Children are dropped - the sub-tree has been reduced away.
 */
function literal(node: INode, value: number): INode {
    return {
        type: NODE.LITERAL,
        value: String(value),
        position: node.position,
        line: node.line,
        column: node.column
    };
}

function valueOf(node: INode): number {
    return Number(node.value);
}

function isValue(node: INode): boolean {
    return node.type === NODE.LITERAL;
}

/**
 * Apply a sign to a value. `-3` is notation for a negative number rather than
 * a step of working out, so it never earns a line of its own in a solution.
 */
function signed(ctx: IContext, node: INode, operand: INode): INode {
    const result = compute(node.value as SYMBOL, 0, valueOf(operand));
    return literal(node, toNumber(ctx, result));
}

/**
 * Replace every name with the value it stands for, so that what is left is
 * pure arithmetic. An assignment target is a name, not a value, and is left
 * alone.
 */
function resolve(ctx: IContext, node: INode): INode {
    switch (node.type) {
        case NODE.LITERAL:
            return literal(node, toNumber(ctx, node.value));

        case NODE.IDENTIFIER: {
            const source = ctx.constants.has(node.value)
                ? ctx.constants
                : ctx.variables;

            if (!source.has(node.value)) {
                throw createError(
                    ERRORS.RUNTIME,
                    `unknown variable '${node.value}' at ${node.line}:${node.column}`,
                    `declare it first, e.g. ${node.value} = 1`
                );
            }

            return literal(node, toNumber(ctx, source.get(node.value)!));
        }

        case NODE.UNARY: {
            const right = resolve(ctx, node.right!);
            return isValue(right)
                ? signed(ctx, node, right)
                : { ...node, right };
        }

        case NODE.BINARY:
            return {
                ...node,
                left: resolve(ctx, node.left!),
                right: resolve(ctx, node.right!)
            };

        case NODE.CALL:
            return {
                ...node,
                arguments: node.arguments!.map((arg) => resolve(ctx, arg))
            };

        case NODE.ASSIGNMENT:
            if (ctx.constants.has(node.left!.value)) {
                throw createError(
                    ERRORS.RUNTIME,
                    `invalid operation: '${node.left!.value}' is a constant`
                );
            }
            return { ...node, right: resolve(ctx, node.right!) };

        default:
            return node;
    }
}

function isReducible(node: INode): boolean {
    switch (node.type) {
        case NODE.UNARY:
        case NODE.BINARY:
        case NODE.CALL:
            return true;
        case NODE.ASSIGNMENT:
            return !isValue(node.right!);
        default:
            return false;
    }
}

/**
 * Collapse every sub-expression whose operands are already values, leaving the
 * rest of the tree untouched. One call is one step of the solution.
 */
function reduceOnce(ctx: IContext, node: INode): INode {
    switch (node.type) {
        case NODE.UNARY: {
            const right = isValue(node.right!)
                ? node.right!
                : reduceOnce(ctx, node.right!);

            return isValue(right)
                ? signed(ctx, node, right)
                : { ...node, right };
        }

        case NODE.BINARY: {
            const left = node.left!;
            const right = node.right!;

            if (isValue(left) && isValue(right)) {
                const result = compute(
                    node.value as SYMBOL,
                    valueOf(left),
                    valueOf(right)
                );
                return literal(node, toNumber(ctx, result));
            }

            return {
                ...node,
                left: isReducible(left) ? reduceOnce(ctx, left) : left,
                right: isReducible(right) ? reduceOnce(ctx, right) : right
            };
        }

        case NODE.CALL: {
            const args = node.arguments!;

            if (args.every(isValue)) {
                const fn = ctx.functions.get(node.value)!;
                return literal(node, toNumber(ctx, fn(...args.map(valueOf))));
            }

            return {
                ...node,
                arguments: args.map((arg) =>
                    isReducible(arg) ? reduceOnce(ctx, arg) : arg
                )
            };
        }

        case NODE.ASSIGNMENT:
            return { ...node, right: reduceOnce(ctx, node.right!) };

        default:
            return node;
    }
}

/**
 * Reduce a tree to a single value, reporting each intermediate tree
 */
function run(
    ctx: IContext,
    node: INode,
    onStep?: (node: INode) => void
): number {
    let current = resolve(ctx, node);

    onStep?.(current);

    while (isReducible(current)) {
        current = reduceOnce(ctx, current);
        onStep?.(current);
    }

    const assignment = current.type === NODE.ASSIGNMENT;

    if (!assignment && !isValue(current)) {
        throw createError(ERRORS.RUNTIME, `unknown node type: ${current.type}`);
    }

    const value = valueOf(assignment ? current.right! : current);

    if (assignment) {
        ctx.variables.set(current.left!.value, value);
    }

    return value;
}

/**
 * Run through the entire AST evaluating the expressions on each subtree
 */
export function evaluate(ctx: IContext, node: INode): number {
    return run(ctx, node);
}

/**
 * Evaluate an expression, recording the working out step by step
 */
export function explain(ctx: IContext, node: INode): IResult {
    const solution: string[] = [];
    const value = run(ctx, node, (step) => solution.push(stringify(step)));

    return { value, solution };
}
