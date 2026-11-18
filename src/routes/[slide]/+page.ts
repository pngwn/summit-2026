import { error } from '@sveltejs/kit';
import { slides, total } from '#lib/deck.ts';
import type { EntryGenerator, PageLoad } from './$types';

// tell the prerenderer about every slide, since nothing links to them directly
export const entries: EntryGenerator = () => slides.map((s) => ({ slide: String(s.n) }));

export const load: PageLoad = ({ params }) => {
	const n = Number(params.slide);
	if (!Number.isInteger(n) || n < 1 || n > total) error(404, `There is no slide ${params.slide}`);
	return { n };
};
