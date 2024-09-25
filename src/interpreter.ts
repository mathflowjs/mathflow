import {
    CONSTANTS,
    DEFAULT_VALUE,
    FUNCTIONS,
    Operator,
    config
} from './global';
import { matchValue } from './helpers';
import { TokenType } from './lexer';
import { Node, NodeType } from './parser';

/**
 * Object to store useful data used during interpretation
 */
export type Scope = {
    variables: Record<string, number>;
};

// tokenize results from evaluated expressions
let id: number;

/**
 * Round off a number to a specific number of decimal points
 */
export function roundOff(value: number): number {
    return Number.parseFloat(value.toFixed(config.fractionDigits));
}

/**
 * Run through the entire AST evaluating the expressions on each subtree
 */
export function interpret(
    node: Node,
    scope: Scope,
    solution: string[],
    reset = false
): number {
    if (reset) {
        // reset result id token
        id = 0;
        reset = false;
    }

    let result: number = DEFAULT_VALUE;
    let left: number;
    let right: number;

    switch (node.type) {
        // handle both floats and integers
        case TokenType.Number: {
            result = Number.parseFloat(node.value as string);
            result = roundOff(result);

            solution.push(`${result}`);
            break;
        }

        // handle all binary operators
        case TokenType.BinaryOperator: {
            // build the solution in parts
            let partial = '';

            // compute node.left first
            left = interpret(node.left as Node, scope, solution);
            left = roundOff(left);

            // build node.left solution
            const trackLeft = matchValue(
                node.left?.type as NodeType,
                TokenType.BinaryOperator,
                TokenType.Function
            );
            if (trackLeft) {
                solution.push(`#${++id}`);
            }
            partial = `(${trackLeft ? '#' + id : left} ${node.operator} `;

            // compute node.right
            right = interpret(node.right as Node, scope, solution);
            right = roundOff(right);

            // build node.right solution
            const trackRight = matchValue(
                node.right?.type as NodeType,
                TokenType.BinaryOperator,
                TokenType.Function
            );
            if (trackRight) {
                solution.push(`#${++id}`);
            }
            partial += `${trackRight ? '#' + id : right})`;

            // save solutions for both node.left and node.right
            solution.push(partial);

            // now apply the operator
            switch (node.operator) {
                case Operator.ADD: {
                    result = left + right;
                    break;
                }

                case Operator.SUB: {
                    result = left - right;
                    break;
                }

                case Operator.MUL: {
                    result = left * right;
                    break;
                }

                case Operator.DIV: {
                    result = left / right;
                    break;
                }

                case Operator.POW: {
                    result = left ** right;
                    break;
                }

                default: {
                    break;
                }
            }

            result = roundOff(result);

            // finally, save operator's result
            solution.push(`${result}`);

            break;
        }

        case TokenType.Function: {
            // first evaluate the argument expression
            // e.g sin(15 + 15) - handle (15 + 15) first
            const args = Array.isArray(node.arguments)
                ? node.arguments.map((arg) => interpret(arg, scope, []))
                : [];

            solution.push(`#${++id}`);
            solution.push(`${node.name}(#${id})`);

            // execute the keyword handler
            result = FUNCTIONS[node.name as string](...args);
            result = roundOff(result);

            solution.push(`${result}`);
            break;
        }

        case TokenType.Constant: {
            result = CONSTANTS[node.name as string];
            result = roundOff(result);

            solution.push(`${result}`);
            break;
        }

        case TokenType.Identifier: {
            // get variable value, fallback to default value
            result = scope.variables[node.name as string] || DEFAULT_VALUE;

            solution.push(`${result}`);
            break;
        }

        default: {
            throw new Error(`Unknown node type: ${node.type}`);
        }
    }

    return result;
}
