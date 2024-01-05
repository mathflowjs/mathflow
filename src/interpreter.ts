import { DEFAULT_VALUE, KEYWORDS, Operator } from './global';
import { TokenType } from './lexer';
import { Node } from './parser';

/**
 * Object to store useful data used during interpretation
 */
export type Scope = {
    variables: Record<string, number>;
};

/**
 * Run through the entire AST evaluating the expressions on each subtree
 */
export function interpret<T extends Node>(node: T, scope: Scope): number {
    let result: number = DEFAULT_VALUE;
    // handle both floats and integers
    switch (node.type) {
        case TokenType.Number: {
            result = Number.parseFloat(node.value);

            break;
        }
        case TokenType.BinaryOperator: {
            switch (node.operator) {
                case Operator.ADD: {
                    result =
                        interpret(node.left, scope) +
                        interpret(node.right, scope);
                    break;
                }

                case Operator.SUB: {
                    result =
                        interpret(node.left, scope) -
                        interpret(node.right, scope);
                    break;
                }

                case Operator.MUL: {
                    result =
                        interpret(node.left, scope) *
                        interpret(node.right, scope);
                    break;
                }

                case Operator.DIV: {
                    result =
                        interpret(node.left, scope) /
                        interpret(node.right, scope);
                    break;
                }

                default: {
                    break;
                }
            }

            break;
        }
        case TokenType.Keyword: {
            result = KEYWORDS[node.name](interpret(node.argument, scope));

            break;
        }
        case TokenType.Identifier: {
            result = scope.variables[node.name] || DEFAULT_VALUE;

            break;
        }
        default: {
            throw new Error(`Unknown node type: ${node.type}`);
        }
    }

    return result;
}
