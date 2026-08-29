import { describe, test, expect, beforeEach } from 'vitest';
import { tokenize } from '../src/lexer';
import { type IContext, createContext } from '../src/context';
import { parse } from '../src/parser';
import { stringify } from '../src/evaluator/solution';

let ctx: IContext;

beforeEach(() => {
    ctx = createContext();
});

function print(expr: string): string {
    return stringify(parse(tokenize(ctx, expr)).body[0]);
}

describe('stringify', () => {
    test('keeps expressions that need no parentheses flat', () => {
        expect(print('1+2')).toBe('1 + 2');
        expect(print('1 + 2 + 3')).toBe('1 + 2 + 3');
        expect(print('2*3/4')).toBe('2 * 3 / 4');
        expect(print('2*(3+4)-5')).toBe('2 * (3 + 4) - 5');
    });

    test('parenthesizes by precedence', () => {
        expect(print('(1+2)*3')).toBe('(1 + 2) * 3');
        expect(print('(1+2)*(3+4)')).toBe('(1 + 2) * (3 + 4)');
        expect(print('((1+2)*(3+4))/(5-3)')).toBe(
            '(1 + 2) * (3 + 4) / (5 - 3)'
        );
    });

    test('parenthesizes right operands that are not left-associative', () => {
        expect(print('1 - (2 - 3)')).toBe('1 - (2 - 3)');
        expect(print('2/(3*4)')).toBe('2 / (3 * 4)');
        expect(print('1 + (2 + 3)')).toBe('1 + (2 + 3)');
    });

    test('renders unary expressions', () => {
        expect(print('-(3+4)')).toBe('-(3 + 4)');
        expect(print('-x')).toBe('-x');
        expect(print('2 - -1')).toBe('2 - -1');
    });

    test('renders calls with any number of arguments', () => {
        expect(print('add(1,2,3)')).toBe('add(1, 2, 3)');
        expect(print('sqrt(16)')).toBe('sqrt(16)');
        expect(print('sin(cos(0))')).toBe('sin(cos(0))');
        expect(print('1 + add(2,3)')).toBe('1 + add(2, 3)');
    });

    test('renders assignments', () => {
        expect(print('x = 3sin(30)')).toBe('x = 3 * sin(30)');
        expect(print('y = 2(x + 1)')).toBe('y = 2 * (x + 1)');
    });

    test('makes implicit multiplication explicit', () => {
        expect(print('2x + 1')).toBe('2 * x + 1');
        expect(print('3pi - 1')).toBe('3 * pi - 1');
        expect(print('(1+3)2')).toBe('(1 + 3) * 2');
    });
});
