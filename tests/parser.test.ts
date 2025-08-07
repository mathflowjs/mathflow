import { parse } from '../src/parser';
import { TokenType, tokenize } from '../src/lexer';

describe('parser', () => {
    test('invalid expressions', () => {
        expect(() => parse(tokenize(`2 +`))).toThrow();
        expect(() => parse(tokenize(`add(2),`))).toThrow();
        expect(() => parse(tokenize(`add(2,)`))).toThrow();
    });
    test('parsing tokens', () => {
        expect(parse(tokenize('1+2'))).toMatchObject({
            left: { type: TokenType.Number, value: '1' },
            right: { type: TokenType.Number, value: '2' },
            operator: '+',
            type: TokenType.BinaryOperator
        });

        const expr = `1 + add(2 + 3, 4 + 5)`;
        expect(() => parse(tokenize(expr))).not.toThrow();
        expect(parse(tokenize(expr))).toMatchObject({
            type: TokenType.BinaryOperator,
            operator: '+',
            left: {
                value: '1',
                type: TokenType.Number
            },
            right: {
                type: TokenType.Function,
                name: 'add',
                arguments: [
                    {
                        type: TokenType.BinaryOperator,
                        operator: '+',
                        left: {
                            value: '2',
                            type: TokenType.Number
                        },
                        right: {
                            value: '3',
                            type: TokenType.Number
                        }
                    },
                    {
                        type: TokenType.BinaryOperator,
                        operator: '+',
                        left: {
                            value: '4',
                            type: TokenType.Number
                        },
                        right: {
                            value: '5',
                            type: TokenType.Number
                        }
                    }
                ]
            }
        });
    });
});
