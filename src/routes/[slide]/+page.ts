import { redirect } from '@sveltejs/kit';
import { resolve } from '$app/paths';
import { find_slide, slides } from '#lib/deck.ts';
import type { EntryGenerator, PageLoad } from './$types';

// tell the prerenderer about every scene, since nothing links to them directly
export const entries: EntryGenerator = () => slides.map((s) => ({ slide: s.id }));

// an unknown scene opens the cover
export const load: PageLoad = ({ params }) => {
	const slide = find_slide(params.slide);
	if (!slide) redirect(307, resolve('/[slide]', { slide: slides[0].id }));
	return { n: slide.n };
};
