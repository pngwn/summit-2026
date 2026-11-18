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
			section
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
