import { type IContext } from '../context';

export default function initTrignometry(pref: IContext['preferences']) {
    const deg = (x: number) => (x * 180) / Math.PI;
    const rad = (x: number) => (x * Math.PI) / 180;

    // an angle going in, and an angle coming out
    const val = (x: number) => (pref.angles === 'deg' ? rad(x) : x);
    const res = (x: number) => (pref.angles === 'deg' ? deg(x) : x);

    return {
        deg,
        rad,
        sin: (x: number) => Math.sin(val(x)),
        cos: (x: number) => Math.cos(val(x)),
        tan: (x: number) => Math.tan(val(x)),
        sind: (x: number) => Math.sin(rad(x)),
        cosd: (x: number) => Math.cos(rad(x)),
        tand: (x: number) => Math.tan(rad(x)),
        // the argument is a ratio, not an angle - only the result is converted
        asin: (x: number) => res(Math.asin(x)),
        acos: (x: number) => res(Math.acos(x)),
        atan: (x: number) => res(Math.atan(x)),
        atan2: (y: number, x: number) => res(Math.atan2(y, x)),
        csc: (x: number) => 1 / Math.sin(val(x)),
        sec: (x: number) => 1 / Math.cos(val(x)),
        cot: (x: number) => 1 / Math.tan(val(x)),
        // hyperbolic functions take and return plain reals, not angles
        sinh: (x: number) => Math.sinh(x),
        cosh: (x: number) => Math.cosh(x),
        tanh: (x: number) => Math.tanh(x),
        asinh: (x: number) => Math.asinh(x),
        acosh: (x: number) => Math.acosh(x),
        atanh: (x: number) => Math.atanh(x),
        hypot: (...x: number[]) => Math.hypot(...x),
        versin: (x: number) => 1 - Math.cos(val(x)),
        coversin: (x: number) => 1 - Math.sin(val(x)),
        versind: (x: number) => 1 - Math.cos(rad(x)),
        coversind: (x: number) => 1 - Math.sin(rad(x))
    };
}
