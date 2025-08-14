import { describe, test, expect, beforeEach } from 'vitest';
import { tokenize } from '../src/lexer';
import { Context, createContext } from '../src/context';
import { NODE, parse } from '../src/parser';

let ctx: Context;

beforeEach(() => {
    ctx = createContext();
});

describe('parser', () => {
    test('parsing tokens', () => {
        expect(parse(tokenize(ctx, '1+2'))).toMatchObject({
            type: NODE.PROGRAM,
            body: [
                {
                    left: { type: NODE.LITERAL, value: '1' },
                    right: { type: NODE.LITERAL, value: '2' },
                    value: '+',
                    type: NODE.BINARY
                }
            ]
        });

        const expr = `1 + add(x - 3, 4 + 5)`;
        expect(parse(tokenize(ctx, expr))).toMatchObject({
            type: NODE.PROGRAM,
            body: [
                {
                    type: NODE.BINARY,
                    value: '+',
                    left: {
                        value: '1',
                        type: NODE.LITERAL
                    },
                    right: {
                        type: NODE.CALL,
                        arguments: [
                            {
                                type: NODE.BINARY,
                                value: '-',
                                left: {
                                    value: 'x',
                                    type: NODE.IDENTIFIER
                                },
                                right: {
                                    value: '3',
                                    type: NODE.LITERAL
                                }
                            },
                            {
                                type: NODE.BINARY,
                                value: '+',
                                left: {
                                    value: '4',
                                    type: NODE.LITERAL
                                },
                                right: {
                                    value: '5',
                                    type: NODE.LITERAL
                                }
                            }
                        ]
                    }
                }
            ]
        });
    });
    test('invalid token streams', () => {
        expect(() => {
            const tokens = tokenize(
                ctx,
                'y = 2x^3 + sqrt(25) - abs(-10) * cos(0)'
            );
            // corrupt the tokens - remove last 4 tokens
            tokens.splice(tokens.length - 4);
            // try parsing
            parse(tokens);
        }).toThrow();
    });
});
