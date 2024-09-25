import { TokenType, tokenize } from '../src/lexer';

describe('lexer', () => {
    test('basic expression', () => {
        expect(tokenize(`1+2-3/4*sin(5)`)).toMatchObject([
            { value: '1', type: TokenType.Number },
            { value: '+', type: TokenType.BinaryOperator },
            { value: '2', type: TokenType.Number },
            { value: '-', type: TokenType.BinaryOperator },
            { value: '3', type: TokenType.Number },
            { value: '/', type: TokenType.BinaryOperator },
            { value: '4', type: TokenType.Number },
            { value: '*', type: TokenType.BinaryOperator },
            { value: 'sin', type: TokenType.Function },
            { value: '(', type: TokenType.OpenParen },
            { value: '5', type: TokenType.Number },
            { value: ')', type: TokenType.ClosedParen },
            { value: 'EOF', type: TokenType.EOF }
        ]);
    });
    test('nested expressions', () => {
        expect(tokenize(`(1 + (2/4) - (1/2)) * 3`)).toMatchObject([
            { value: '(', type: TokenType.OpenParen },
            { value: '1', type: TokenType.Number },
            { value: '+', type: TokenType.BinaryOperator },
            { value: '(', type: TokenType.OpenParen },
            { value: '2', type: TokenType.Number },
            { value: '/', type: TokenType.BinaryOperator },
            { value: '4', type: TokenType.Number },
            { value: ')', type: TokenType.ClosedParen },
            { value: '-', type: TokenType.BinaryOperator },
            { value: '(', type: TokenType.OpenParen },
            { value: '1', type: TokenType.Number },
            { value: '/', type: TokenType.BinaryOperator },
            { value: '2', type: TokenType.Number },
            { value: ')', type: TokenType.ClosedParen },
            { value: ')', type: TokenType.ClosedParen },
            { value: '*', type: TokenType.BinaryOperator },
            { value: '3', type: TokenType.Number },
            { value: 'EOF', type: TokenType.EOF }
        ]);
    });
    test('identifiers', () => {
        expect(tokenize(`tan(a) + cos(b) + sin(c)`)).toMatchObject([
            { value: 'tan', type: TokenType.Function },
            { value: '(', type: TokenType.OpenParen },
            { value: 'a', type: TokenType.Identifier },
            { value: ')', type: TokenType.ClosedParen },
            { value: '+', type: TokenType.BinaryOperator },
            { value: 'cos', type: TokenType.Function },
            { value: '(', type: TokenType.OpenParen },
            { value: 'b', type: TokenType.Identifier },
            { value: ')', type: TokenType.ClosedParen },
            { value: '+', type: TokenType.BinaryOperator },
            { value: 'sin', type: TokenType.Function },
            { value: '(', type: TokenType.OpenParen },
            { value: 'c', type: TokenType.Identifier },
            { value: ')', type: TokenType.ClosedParen },
            { value: 'EOF', type: TokenType.EOF }
        ]);
    });
    test('variadic parameters', () => {
        expect(tokenize(`add(1+2,3,4)`)).toMatchObject([
            { value: 'add', type: TokenType.Function },
            { value: '(', type: TokenType.OpenParen },
            { value: '1', type: TokenType.Number },
            { value: '+', type: TokenType.BinaryOperator },
            { value: '2', type: TokenType.Number },
            { value: ',', type: TokenType.Comma },
            { value: '3', type: TokenType.Number },
            { value: ',', type: TokenType.Comma },
            { value: '4', type: TokenType.Number },
            { value: ')', type: TokenType.ClosedParen },
            { value: 'EOF', type: TokenType.EOF }
        ]);
    });
    test('invalid expression', () => {
        expect(() => tokenize(`sin(x`)).toThrow();
        expect(() => tokenize(`2. + 3`)).toThrow();
        expect(() => tokenize(`1+2, 3`)).toThrow();
    });
});
