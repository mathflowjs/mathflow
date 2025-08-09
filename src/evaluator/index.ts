import { type Node, NODE } from '../parser';
import { type Context } from '../context';
import { createError, ERRORS } from '../error';
import { SYMBOL } from '../lexer/tokens';
import { Solution } from './solution';

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
export function evaluate(ctx: Context, node: Node, solution: Solution): number {
    let result = 0;
    let left: number;
    let right: number;

    function toNumber(value: string | number) {
        value = Number(value).toPrecision(
            ctx.preferences.precision
        )
        value = Number(value).toFixed(ctx.preferences.fractionDigits);
        return Number.parseFloat(value)
    }

    switch (node.type) {
        // handle both floats and integers
        case NODE.LITERAL: {
            result = toNumber(node.value);
            solution?.push(result);
            break;
        }

        // explicit negative/positive sign
        case NODE.UNARY: {
            left = 0;
            right = evaluate(ctx, node.right!, solution);
            result = compute(node.value as SYMBOL, left, right);

            solution.push(result);
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
            if (trackLeft) solution.advance();
            partial = `(${trackLeft ? '#' + solution.id : left} ${node.value} `;

            // compute node.right
            right = evaluate(ctx, node.right!, solution);

            // build node.right solution
            const trackRight =
                node.right?.type === NODE.BINARY ||
                node.right?.type === NODE.CALL;
            if (trackRight) solution.advance();
            partial += `${trackRight ? '#' + solution.id : right})`;

            // save solutions for both nodes - left & right
            solution.push(partial);

            // apply binary operator
            result = compute(node.value as SYMBOL, left, right);

            // save final result
            solution.push(result);
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

            solution.advance();
            solution.push(`${node.value}(#${solution.id})`);
            solution.push(result);
            break;
        }

        case NODE.IDENTIFIER: {
            if (ctx.constants.has(node.value)) {
                result = ctx.constants.get(node.value)!;
            } else {
                result = ctx.variables.get(node.value) || 0;
            }

            solution.push(result);
            break;
        }

        case NODE.ASSIGNMENT: {
            if (ctx.constants.has(node.left!.value)) {
                throw createError(
                    ERRORS.RUNTIME,
                    `invalid operation: '${node.left!.value}' is a constant`
                );
            }
            result = evaluate(ctx, node.right!, solution);
            ctx.variables.set(node.left!.value, result);
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
