import type { Component } from 'svelte';

export interface SlideMeta {
	/** shown in the presenter view and the browser tab */
	title?: string;
	/** speaker notes, shown in the presenter view only */
	notes?: string;
	/** which mdsvex template wraps the slide (see vite.config.ts) */
	template?: string;
	[key: string]: unknown;
}

export interface Section {
	title: string;
	/** I, II, III … */
	numeral: string;
}

export interface Slide {
	/** 1-based position in the deck */
	n: number;
	/** path under src/slides without extension, e.g. `03-commonmark/02-headings` */
	id: string;
	component: Component<Record<string, unknown>>;
	meta: SlideMeta;
	/** the section this slide sits in: the nearest `template: section` slide at or before it */
	section?: Section;
	/** how many times → stays on this slide: `steps` in frontmatter, 2 for a diff, else 1 */
	steps: number;
}

/** where the deck is: a slide, and the step within it (0-based) */
export interface Position {
	n: number;
	step: number;
}

type SlideModule = { default: Component<Record<string, unknown>>; metadata?: SlideMeta };

// Every file under src/slides is a slide, ordered by path: a folder per section,
// `01-`, `02-` … prefixes inside it
const modules = import.meta.glob<SlideModule>('/src/slides/**/*.{md,svx}', { eager: true });

const ROMAN = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII', 'XIII'];

let section: Section | undefined;
let sections = 0;

export const slides: Slide[] = Object.entries(modules)
	.sort(([a], [b]) => a.localeCompare(b, undefined, { numeric: true }))
	.map(([path, mod], i) => {
		const meta = mod.metadata ?? {};
		if (meta.template === 'section') {
			section = { title: meta.title ?? '', numeral: ROMAN[sections++] ?? String(sections) };
		}
		return {
			n: i + 1,
			id: path.replace('/src/slides/', '').replace(/\.(md|svx)$/, ''),
			component: mod.default,
			meta,
			section,
			steps: Number(meta.steps) || (meta.template === 'diff' ? 2 : 1)
		};
	});

export const total = slides.length;

export function get_slide(n: number): Slide | undefined {
	return slides[n - 1];
}

/** clamp a slide number into the deck */
export function clamp(n: number): number {
	return Math.min(Math.max(1, n), total);
}

/** clamp a step into its slide */
export function clamp_step(n: number, step: number): number {
	const steps = get_slide(n)?.steps ?? 1;
	return Math.min(Math.max(0, step), steps - 1);
}

/** the next step, or the next slide's first */
export function next(pos: Position): Position {
	if (pos.step < (get_slide(pos.n)?.steps ?? 1) - 1) return { n: pos.n, step: pos.step + 1 };
	if (pos.n < total) return { n: pos.n + 1, step: 0 };
	return pos;
}

/** the previous step, or the previous slide's last, as if you had stepped through it */
export function prev(pos: Position): Position {
	if (pos.step > 0) return { n: pos.n, step: pos.step - 1 };
	if (pos.n > 1) return { n: pos.n - 1, step: (get_slide(pos.n - 1)?.steps ?? 1) - 1 };
	return pos;
}
