import { redirect } from '@sveltejs/kit';
import { resolve } from '$app/paths';
import { slides } from '#lib/deck.ts';

// an empty address opens the cover
export function load() {
	redirect(307, resolve('/[slide]', { slide: slides[0].id }));
}
