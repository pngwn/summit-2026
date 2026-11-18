import { getContext, setContext } from 'svelte';

const KEY = Symbol('recipe-scale');

/** how many times the written recipe the reader is making, shared with its ingredients */
export interface Scale {
	readonly factor: number;
}

export const set_scale = (scale: Scale) => setContext(KEY, scale);
export const get_scale = (): Scale => getContext<Scale>(KEY) ?? { factor: 1 };

const FRACTIONS: [number, string][] = [
	[0.25, '¼'],
	[0.5, '½'],
	[0.75, '¾'],
	[1 / 3, '⅓'],
	[2 / 3, '⅔']
];

/** a quantity as a cook writes it: whole grams, an egg and a half as 1½ */
export function amount(qty: number, unit: string): string {
	if (unit === 'g' || unit === 'ml') return `${Math.round(qty / 5) * 5 || Math.round(qty)} ${unit}`;
	const whole = Math.floor(qty + 1e-9);
	const rest = qty - whole;
	const frac = FRACTIONS.find(([v]) => Math.abs(v - rest) < 0.06)?.[1];
	const n = rest < 0.06 ? String(whole) : frac ? `${whole || ''}${frac}` : qty.toFixed(1);
	return unit ? `${n} ${unit}` : n;
}
