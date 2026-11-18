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

export interface Slide {
	/** 1-based position in the deck */
	n: number;
	/** file name without extension, e.g. `02-hello` */
	id: string;
	component: Component;
	meta: SlideMeta;
}

type SlideModule = { default: Component; metadata?: SlideMeta };

// Every file in src/slides is a slide; file names decide the order, so prefix them `01-`, `02-` …
const modules = import.meta.glob<SlideModule>('/src/slides/*.{md,svx}', { eager: true });

export const slides: Slide[] = Object.entries(modules)
	.sort(([a], [b]) => a.localeCompare(b, undefined, { numeric: true }))
	.map(([path, mod], i) => ({
		n: i + 1,
		id: path
			.split('/')
			.pop()!
			.replace(/\.(md|svx)$/, ''),
		component: mod.default,
		meta: mod.metadata ?? {}
	}));

export const total = slides.length;

export function get_slide(n: number): Slide | undefined {
	return slides[n - 1];
}

/** clamp a slide number into the deck */
export function clamp(n: number): number {
	return Math.min(Math.max(1, n), total);
}
