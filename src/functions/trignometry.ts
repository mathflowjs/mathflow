import { type IContext } from '../context';

export default function initTrignometry(pref: IContext['preferences']) {
    const deg = (x: number) => (x * 180) / Math.PI;
    const rad = (x: number) => (x * Math.PI) / 180;

    const val = (x: number) => (pref.angles === 'deg' ? rad(x) : x);
    const res = (x: number) => (pref.angles === 'deg' ? deg(x) : x);

    return {
        deg,
        rad,
        sin: (x: number) => Math.sin(val(x)),
        cos: (x: number) => Math.cos(val(x)),
        tan: (x: number) => Math.tan(val(x)),
        asin: (x: number) => res(Math.asin(val(x))),
        acos: (x: number) => res(Math.acos(val(x))),
        atan: (x: number) => res(Math.atan(val(x))),
        csc: (x: number) => 1 / Math.sin(val(x)),
        sec: (x: number) => 1 / Math.cos(val(x)),
        cot: (x: number) => 1 / Math.tan(val(x)),
        sinh: (x: number) => Math.sinh(val(x)),
        cosh: (x: number) => Math.cosh(val(x)),
        tanh: (x: number) => Math.tanh(val(x)),
        asinh: (x: number) => res(Math.asinh(val(x))),
        acosh: (x: number) => res(Math.acosh(val(x))),
        atanh: (x: number) => res(Math.atanh(val(x))),
        hypot: (...x: number[]) => Math.hypot(...x),
        versin: (x: number) => 1 - Math.cos(val(x)),
        coversin: (x: number) => 1 - Math.sin(val(x))
    };
}
