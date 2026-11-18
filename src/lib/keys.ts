import { resolve } from '$app/paths';
import { next, prev, slides, type Position } from '#lib/deck.ts';

const INTERACTIVE = 'input, textarea, select, button, a, [contenteditable]';

/**
 * Shared keyboard controls for the audience and presenter views. → and space step through
 * a slide's steps before moving on; ← steps back, landing on a slide's last step.
 * Calls `go` with the position to move to, or handles the key itself (fullscreen, presenter).
 */
export function handle_deck_key(e: KeyboardEvent, pos: Position, go: (pos: Position) => void) {
	if (e.metaKey || e.ctrlKey || e.altKey) return;
	// let live components inside a slide keep their keys (space on a button, typing in an input…)
	if (e.target instanceof Element && e.target.closest(INTERACTIVE)) return;

	switch (e.key) {
		case 'ArrowRight':
		case 'ArrowDown':
		case 'PageDown':
		case ' ':
			go(e.shiftKey && e.key === ' ' ? prev(pos) : next(pos));
			break;
		case 'ArrowLeft':
		case 'ArrowUp':
		case 'PageUp':
			go(prev(pos));
			break;
		case 'Home':
			go({ n: 1, step: 0 });
			break;
		case 'End':
			go({ n: slides.length, step: 0 });
			break;
		case 'f':
			if (document.fullscreenElement) document.exitFullscreen();
			else document.documentElement.requestFullscreen();
			break;
		case 'p':
			window.open(
				resolve('/presenter/[slide]', { slide: String(pos.n) }) + (pos.step ? `#${pos.step}` : ''),
				'presenter',
				'popup,width=1400,height=900'
			);
			break;
		default:
			return;
	}

	e.preventDefault();
}

/** the step a URL is on: its hash, `/7#1` is slide 7's second step */
export function step_from_hash(hash: string): number {
	return Number(hash.slice(1)) || 0;
}
