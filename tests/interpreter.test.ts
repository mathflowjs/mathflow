import { interpret } from '../src/interpreter';
import { tokenize } from '../src/lexer';
import { parse } from '../src/parser';

describe('interpreter', () => {
    test('simple ast tree', () => {
        const expr = '1+2+x';
        const tokens = tokenize(expr);
        const ast = parse(tokens);
        const scope = { variables: { x: 1 } };
        expect(interpret(ast, scope, [], true)).toBe(4);
    });
    test('complex ast tree', () => {
        const expr = `1 + add(x + 3, cosd(60) + 0.5)`;
        const fn = jest.fn(() => {
            const tokens = tokenize(expr);
            const ast = parse(tokens);
            const scope = { variables: { x: 2 } };
            return interpret(ast, scope, [], true);
        });
        fn();
        expect(fn).not.toThrow();
        expect(fn).toHaveReturnedWith(7);
    });
});
