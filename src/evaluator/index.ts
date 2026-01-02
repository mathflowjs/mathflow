import { type INode, NODE } from '../parser';
import { type IContext } from '../context';
import { createError, ERRORS } from '../error';
import { SYMBOL } from '../lexer/tokens';
import { ISolution, advance, pushValue } from './solution';

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
            break;
    }
}

/**
 * Run through the entire AST evaluating the expressions on each subtree left to right
 */
export function evaluate(
    ctx: IContext,
    node: INode,
    solution: ISolution
): number {
    let result = 0;
    let left: number;
    let right: number;

    function toNumber(value: string | number) {
        value = value.toString();
        if (ctx.preferences.precision && ctx.preferences.precision > 0) {
            value = Number(value).toPrecision(ctx.preferences.precision);
        }
        if (
            ctx.preferences.fractionDigits &&
            ctx.preferences.fractionDigits > 0
        ) {
            value = Number(value).toFixed(ctx.preferences.fractionDigits);
        }
        return Number.parseFloat(value);
    }

    switch (node.type) {
        // handle both floats and integers
        case NODE.LITERAL: {
            result = toNumber(node.value);
            pushValue(solution, result);
            break;
        }

        // explicit negative/positive sign
        case NODE.UNARY: {
            left = 0;
            right = evaluate(ctx, node.right!, solution);
            result = compute(node.value as SYMBOL, left, right);

            pushValue(solution, result);
            break;
        }

        // handle all binary operations
        case NODE.BINARY: {
            // build the solution in parts
            let partial = '';

            // compute node.left first
            left = evaluate(ctx, node.left!, solution);

            // build node.left solution
            const trackLeft =
                node.left?.type === NODE.BINARY ||
                node.left?.type === NODE.CALL;
            if (trackLeft) advance(solution);
            partial = `(${trackLeft ? '#' + solution.id : left} ${node.value} `;

            // compute node.right
            right = evaluate(ctx, node.right!, solution);

            // build node.right solution
            const trackRight =
                node.right?.type === NODE.BINARY ||
                node.right?.type === NODE.CALL;
            if (trackRight) advance(solution);
            partial += `${trackRight ? '#' + solution.id : right})`;

            // save solutions for both nodes - left & right
            pushValue(solution, partial);

            // apply binary operator
            result = compute(node.value as SYMBOL, left, right);

            result = toNumber(result);

            // save final result
            pushValue(solution, result);
            break;
        }

        case NODE.CALL: {
            // first evaluate the arguments
            // e.g. sin(15 + 15) - compute (15 + 15) first
            const args = node.arguments!.map((arg) =>
                evaluate(ctx, arg, solution)
            );
            const fn = ctx.functions.get(node.value)!;
            result = fn(...args);

            result = toNumber(result);

            if (args.length === 1) {
                advance(solution);
                pushValue(solution, `${node.value}(#${solution.id})`);
            }

            pushValue(solution, result);

            break;
        }

        case NODE.IDENTIFIER: {
            if (ctx.constants.has(node.value)) {
                result = ctx.constants.get(node.value)!;
            } else {
                result = ctx.variables.get(node.value) || 0;
            }
            result = toNumber(result);

            pushValue(solution, result);
            break;
        }

        case NODE.ASSIGNMENT: {
            if (ctx.constants.has(node.left!.value)) {
                throw createError(
                    ERRORS.RUNTIME,
                    `invalid operation: '${node.left!.value}' is a constant`
                );
            }

            // build solution like binary ops

            let partial = `${node.left!.value} ${node.value} `;

            // compute node.right
            right = evaluate(ctx, node.right!, solution);

            // build node.right solution
            const trackRight =
                node.right?.type === NODE.BINARY ||
                node.right?.type === NODE.CALL;
            if (trackRight) advance(solution);
            partial += `${trackRight ? '#' + solution.id : right}`;

            pushValue(solution, partial);

            result = right;
            ctx.variables.set(node.left!.value, right);

            pushValue(solution, result);
            break;
        }

        default: {
            throw createError(
                ERRORS.RUNTIME,
                `unknown node type: ${node.type}`
            );
        }
    }

    return toNumber(result);
}
