import { parse } from '../src/parser';
import { TokenType, tokenize } from '../src/lexer';

describe('parser', () => {
    test('parsing tokens', () => {
        expect(parse(tokenize('1+2'))).toMatchObject({
            left: { type: TokenType.Number, value: '1' },
            right: { type: TokenType.Number, value: '2' },
            operator: '+',
            type: TokenType.BinaryOperator
        });
        expect(() => parse(tokenize(`2 +`))).toThrow();
    });
});
