import { interpret } from '../src/interpreter';
import { tokenize } from '../src/lexer';
import { parse } from '../src/parser';

describe('interpreter', () => {
    test('interpret ast tree', () => {
        const expr = '1+2+x';
        const tokens = tokenize(expr);
        const ast = parse(tokens);
        const scope = { variables: { x: 1 } };
        expect(interpret(ast, scope)).toBe(4);
    });
});
