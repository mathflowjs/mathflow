import { evaluate } from '../src/index';

describe('mathscript', () => {
    test('comments', () => {
        expect(evaluate(`# this is a comment`)).toMatchObject({
            value: 0,
            scope: { variables: {} }
        });
    });
    test('variable declaration', () => {
        expect(evaluate(`a = 1`)).toMatchObject({
            value: 0,
            scope: { variables: { a: 1 } }
        });
    });
    test('return value', () => {
        expect(evaluate(`1.2+1.8-2`)).toMatchObject({
            value: 1,
            scope: { variables: {} }
        });
    });
    test('full program', () => {
        expect(
            evaluate(`
        # this is a comment
        a = 1
        b = 2
        c = a + b
        a + b + c
        `)
        ).toMatchObject({
            value: 6,
            scope: { variables: { a: 1, b: 2, c: 3 } }
        });
    });
    test('some built-in functions', () => {
        expect(evaluate(`sin(30) + cos(60) + tan(45)`)).toMatchObject({
            value: 2,
            scope: { variables: {} }
        });
    });
});
