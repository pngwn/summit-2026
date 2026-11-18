import { browser } from '$app/env';
import { goto } from '$app/navigation';
import { resolve } from '$app/paths';
import { page } from '$app/state';
import { clamp_step, type Position } from '#lib/deck.ts';
import { step_from_hash } from '#lib/keys.ts';
import { broadcast, on_remote_goto } from '#lib/sync.ts';

type Route = '/[slide]' | '/presenter/[slide]';

/**
 * The deck's position for a view (audience or presenter): the slide comes from the route,
 * the step from the URL's hash, so a reload or a shared link lands on the same step.
 * `go` moves there and tells the other window; the other window's moves are followed.
 * Call it during component init, since it registers an effect.
 */
export function deck_nav(route: Route, get_n: () => number) {
	// the hash only exists in the browser, so a prerendered page is on step 0. Hydration
	// keeps the server's attributes even where the client's differ, so the step from the
	// hash applies only once hydrated, as an ordinary update
	let hydrated = $state(false);
	$effect(() => {
		hydrated = true;
	});

	const pos = $derived<Position>({
		n: get_n(),
		step: browser && hydrated ? clamp_step(get_n(), step_from_hash(page.url.hash)) : 0
	});

	function go(to: Position, from_remote = false) {
		if (to.n === pos.n && to.step === pos.step) return;
		if (!from_remote) broadcast(to);
		const href = resolve(route, { slide: String(to.n) }) + (to.step ? `#${to.step}` : '');
		// steps within a slide replace the history entry, so back goes to the previous slide
		goto(href, { reset: false, replace: to.n === pos.n });
	}

	$effect(() => on_remote_goto((to) => go(to, true)));

	return {
		get pos() {
			return pos;
		},
		go
	};
}
