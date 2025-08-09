import { describe, test, expect, beforeEach } from 'vitest'
import { tokenize } from '../src/lexer';
import { TOKEN } from '../src/lexer/tokens';
import { Context, createContext } from '../src/context';

let ctx: Context

beforeEach(() => {
    ctx = createContext()
})

describe('lexer', () => {
    test('basic expression', () => {
        expect(tokenize(ctx, `1+2-3/4*sin(5)`)).toMatchObject([
            { value: '1', type: TOKEN.NUMBER },
            { value: '+', type: TOKEN.OPERATOR },
            { value: '2', type: TOKEN.NUMBER },
            { value: '-', type: TOKEN.OPERATOR },
            { value: '3', type: TOKEN.NUMBER },
            { value: '/', type: TOKEN.OPERATOR },
            { value: '4', type: TOKEN.NUMBER },
            { value: '*', type: TOKEN.OPERATOR },
            { value: 'sin', type: TOKEN.FUNCTION },
            { value: '(', type: TOKEN.LPAREN },
            { value: '5', type: TOKEN.NUMBER },
            { value: ')', type: TOKEN.RPAREN },
            { value: '\n', type: TOKEN.NEWLINE },
            { value: 'EOF', type: TOKEN.EOF }
        ]);
    });
    test('nested expressions', () => {
        expect(tokenize(ctx, `(1 + (2/4) - (1/2)) * 3`)).toMatchObject([
            { value: '(', type: TOKEN.LPAREN },
            { value: '1', type: TOKEN.NUMBER },
            { value: '+', type: TOKEN.OPERATOR },
            { value: '(', type: TOKEN.LPAREN },
            { value: '2', type: TOKEN.NUMBER },
            { value: '/', type: TOKEN.OPERATOR },
            { value: '4', type: TOKEN.NUMBER },
            { value: ')', type: TOKEN.RPAREN },
            { value: '-', type: TOKEN.OPERATOR },
            { value: '(', type: TOKEN.LPAREN },
            { value: '1', type: TOKEN.NUMBER },
            { value: '/', type: TOKEN.OPERATOR },
            { value: '2', type: TOKEN.NUMBER },
            { value: ')', type: TOKEN.RPAREN },
            { value: ')', type: TOKEN.RPAREN },
            { value: '*', type: TOKEN.OPERATOR },
            { value: '3', type: TOKEN.NUMBER },
            { value: '\n', type: TOKEN.NEWLINE },
            { value: 'EOF', type: TOKEN.EOF }
        ]);
    });
    test('identifiers', () => {
        expect(tokenize(ctx, `tan(a) + cos(b) + sin(c)`)).toMatchObject([
            { value: 'tan', type: TOKEN.FUNCTION },
            { value: '(', type: TOKEN.LPAREN },
            { value: 'a', type: TOKEN.IDENTIFIER },
            { value: ')', type: TOKEN.RPAREN },
            { value: '+', type: TOKEN.OPERATOR },
            { value: 'cos', type: TOKEN.FUNCTION },
            { value: '(', type: TOKEN.LPAREN },
            { value: 'b', type: TOKEN.IDENTIFIER },
            { value: ')', type: TOKEN.RPAREN },
            { value: '+', type: TOKEN.OPERATOR },
            { value: 'sin', type: TOKEN.FUNCTION },
            { value: '(', type: TOKEN.LPAREN },
            { value: 'c', type: TOKEN.IDENTIFIER },
            { value: ')', type: TOKEN.RPAREN },
            { value: '\n', type: TOKEN.NEWLINE },
            { value: 'EOF', type: TOKEN.EOF }
        ]);
    });
    test('variadic parameters', () => {
        expect(tokenize(ctx, `add(1+2,3,4)`)).toMatchObject([
            { value: 'add', type: TOKEN.FUNCTION },
            { value: '(', type: TOKEN.LPAREN },
            { value: '1', type: TOKEN.NUMBER },
            { value: '+', type: TOKEN.OPERATOR },
            { value: '2', type: TOKEN.NUMBER },
            { value: ',', type: TOKEN.COMMA },
            { value: '3', type: TOKEN.NUMBER },
            { value: ',', type: TOKEN.COMMA },
            { value: '4', type: TOKEN.NUMBER },
            { value: ')', type: TOKEN.RPAREN },
            { value: '\n', type: TOKEN.NEWLINE },
            { value: 'EOF', type: TOKEN.EOF }
        ]);
    });
    test('invalid expression', () => {
        expect(() => tokenize(ctx, `sin(x`)).toThrow();
        expect(() => tokenize(ctx, `2. + 3`)).toThrow();
        expect(() => tokenize(ctx, `1+2, 3`)).toThrow();
    });
});
