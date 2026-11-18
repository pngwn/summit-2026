import { resolve } from '$app/paths';
import { clamp, total } from '#lib/deck.ts';

const INTERACTIVE = 'input, textarea, select, button, a, [contenteditable]';

/**
 * Shared keyboard controls for the audience and presenter views.
 * Calls `go` with the target slide number, or handles the key itself (fullscreen, presenter).
 */
export function handle_deck_key(e: KeyboardEvent, n: number, go: (n: number) => void) {
	if (e.metaKey || e.ctrlKey || e.altKey) return;
	// let live components inside a slide keep their keys (space on a button, typing in an input…)
	if (e.target instanceof Element && e.target.closest(INTERACTIVE)) return;

	switch (e.key) {
		case 'ArrowRight':
		case 'ArrowDown':
		case 'PageDown':
		case ' ':
			if (e.shiftKey && e.key === ' ') go(clamp(n - 1));
			else go(clamp(n + 1));
			break;
		case 'ArrowLeft':
		case 'ArrowUp':
		case 'PageUp':
			go(clamp(n - 1));
			break;
		case 'Home':
			go(1);
			break;
		case 'End':
			go(total);
			break;
		case 'f':
			if (document.fullscreenElement) document.exitFullscreen();
			else document.documentElement.requestFullscreen();
			break;
		case 'p':
			window.open(
				resolve('/presenter/[slide]', { slide: String(n) }),
				'presenter',
				'popup,width=1400,height=900'
			);
			break;
		default:
			return;
	}

	e.preventDefault();
}
