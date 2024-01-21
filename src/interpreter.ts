import { DEFAULT_VALUE, KEYWORDS, Operator } from './global';
import { TokenType } from './lexer';
import { Node } from './parser';

/**
 * Object to store useful data used during interpretation
 */
export type Scope = {
    variables: Record<string, number>;
};

// tokenize results from evaluated expressions
let id: number;

/**
 * Run through the entire AST evaluating the expressions on each subtree
 */
export function interpret<T extends Node>(
    node: T,
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
            result = Number.parseFloat(node.value);

            solution.push(`${result}`);
            break;
        }

        // handle all binary operators
        case TokenType.BinaryOperator: {
            // build the solution in parts
            let partial = '';

            // compute node.left first
            left = interpret(node.left, scope, solution);

            // build node.left solution
            const trackLeft =
                node.left?.type === TokenType.BinaryOperator ||
                node.left?.type === TokenType.Keyword;
            if (trackLeft) {
                solution.push(`#${++id}`);
            }
            partial = `(${trackLeft ? '#' + id : left} ${node.operator} `;

            // compute node.right
            right = interpret(node.right, scope, solution);

            // build node.right solution
            const trackRight =
                node.right?.type === TokenType.BinaryOperator ||
                node.right?.type === TokenType.Keyword;
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

                default: {
                    break;
                }
            }

            // finally, save operator's result
            solution.push(`${result}`);

            break;
        }
        case TokenType.Keyword: {
            // first evaluate the argument expression
            // e.g sin(15 + 15) - handle (15 + 15) first
            result = interpret(node.argument, scope, solution);

            solution.push(`#${++id}`);
            solution.push(`${node.name}(#${id})`);

            // execute the keyword handler
            result = KEYWORDS[node.name](result);

            solution.push(`${result}`);
            break;
        }
        case TokenType.Identifier: {
            // get variable value, fallback to default value
            result = scope.variables[node.name] || DEFAULT_VALUE;

            solution.push(`${result}`);
            break;
        }
        default: {
            throw new Error(`Unknown node type: ${node.type}`);
        }
    }

    return result;
}
