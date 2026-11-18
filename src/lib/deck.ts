import type { Component } from 'svelte';

export interface SceneMeta {
	/** the contents label, the document title and the announcement */
	name?: string;
	/** the chapter this scene starts; later scenes stay in it until one names another */
	chapter?: string;
	/** what to say, shown in the notes dialog (N) and the presenter view */
	notes?: string;
	/** the layout family: an mdsvex template, see vite.config.ts */
	template?: string;
	steps?: number;
	[key: string]: unknown;
}

export interface Slide {
	/** 1-based position in the deck */
	n: number;
	/** the scene's address, from its file name without the order prefix: `/migration` */
	id: string;
	name: string;
	chapter: string;
	notes: string;
	component: Component<Record<string, unknown>>;
	meta: SceneMeta;
	/** how many times → stays on this scene: `steps` in frontmatter, 2 for a diff, else 1 */
	steps: number;
}

/** where the deck is: a scene, and the step within it (0-based) */
export interface Position {
	n: number;
	step: number;
}

type SlideModule = { default: Component<Record<string, unknown>>; metadata?: SceneMeta };

// Every file under src/slides is a scene, ordered by path: a folder per chapter,
// `01-`, `02-` … prefixes inside it. The name after the prefix is the scene's id
const modules = import.meta.glob<SlideModule>('/src/slides/**/*.{md,svx}', { eager: true });

let chapter = '';

export const slides: Slide[] = Object.entries(modules)
	.sort(([a], [b]) => a.localeCompare(b, undefined, { numeric: true }))
	.map(([path, mod], i) => {
		const meta = mod.metadata ?? {};
		const id = path.replace(/^.*\/(\d+-)?/, '').replace(/\.(md|svx)$/, '');
		chapter = meta.chapter ?? chapter;
		return {
			n: i + 1,
			id,
			name: meta.name ?? id,
			chapter,
			notes: meta.notes ?? '',
			component: mod.default,
			meta,
			steps: Number(meta.steps) || (meta.template === 'diff' ? 2 : 1)
		};
	});

export const total = slides.length;

const by_id = new Map(slides.map((s) => [s.id, s]));
if (by_id.size !== total) throw new Error('Two scenes share an id: rename one of the files');

export function get_slide(n: number): Slide | undefined {
	return slides[n - 1];
}

export function find_slide(id: string): Slide | undefined {
	return by_id.get(id);
}

/** clamp a step into its scene */
export function clamp_step(n: number, step: number): number {
	const steps = get_slide(n)?.steps ?? 1;
	return Math.min(Math.max(0, step), steps - 1);
}

/** the next step, or the next scene's first */
export function next(pos: Position): Position {
	if (pos.step < (get_slide(pos.n)?.steps ?? 1) - 1) return { n: pos.n, step: pos.step + 1 };
	if (pos.n < total) return { n: pos.n + 1, step: 0 };
	return pos;
}

/** the previous step, or the previous scene's last, as if you had stepped through it */
export function prev(pos: Position): Position {
	if (pos.step > 0) return { n: pos.n, step: pos.step - 1 };
	if (pos.n > 1) return { n: pos.n - 1, step: (get_slide(pos.n - 1)?.steps ?? 1) - 1 };
	return pos;
}
