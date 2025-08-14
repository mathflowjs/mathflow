import initNumbers from './numbers';
import initLogarithms from './logarithms';
import initTrignometry from './trignometry';
import { Context } from '../context';

export type ComputeFunction = (...args: number[]) => number;

export function addBuiltinFunctions(ctx: Context) {
    const fns: Record<string, ComputeFunction> = {
        ...initNumbers(),
        ...initLogarithms(),
        ...initTrignometry(ctx.preferences)
    };

    for (const name in fns) {
        const fn = fns[name];
        ctx.functions.set(name, fn);
    }
}
