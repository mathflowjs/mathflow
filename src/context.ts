import { solve, solveBatch, type Result } from './solve';
import { addBuiltinFunctions, type ComputeFunction } from './functions';

type Preferences = {
    fractionDigits: number;
    precision: number;
    angles: 'rad' | 'deg';
    [k: string]: string | number;
};

export type Context = {
    preferences: Partial<Preferences>;
    variables: Map<string, number>;
    constants: Map<string, number>;
    functions: Map<string, ComputeFunction>;
};

export interface ContextAPI extends Context {
    solve: (code: string) => Result;
    solveBatch: (code: string) => Result[];
}

export type ContextOptions = {
    preferences: Partial<Preferences>;
    variables: Record<string, number>;
    constants: Record<string, number>;
    functions: Record<string, ComputeFunction>;
};

function merge<T>(dest: Map<string, T>, src: Record<string, T>) {
    for (const k in src) {
        const v = src[k];
        dest.set(k, v);
    }
}

/**
 * isolated math execution context
 */
export function createContext(
    options: Partial<ContextOptions> = {}
): ContextAPI {
    const ctx: Context = {
        variables: new Map(),
        functions: new Map(),
        preferences: {
            fractionDigits: 15,
            precision: 15,
            angles: 'rad'
        },
        constants: new Map([['pi', Math.PI]])
    };

    if (options?.preferences) {
        for (const k in ctx.preferences) {
            const v = options.preferences[k];
            if (v) ctx.preferences[k] = v;
        }
    }

    if (options?.constants) {
        merge(ctx.constants, options.constants);
    }

    if (options?.variables) {
        merge(ctx.variables, options.variables);
    }

    if (options?.functions) {
        merge(ctx.functions, options.functions);
    }

    addBuiltinFunctions(ctx);

    return {
        ...ctx,
        solve: (code: string) => solve(ctx, code),
        solveBatch: (code: string) => solveBatch(ctx, code)
    };
}
