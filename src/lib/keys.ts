import { resolve } from '$app/paths';
import { next, prev, slides, type Position } from '#lib/deck.ts';

/** a control inside a scene: it keeps its own keys and clicks */
export const CONTROL =
	'input, textarea, select, button, a, dialog, [role=button], [contenteditable]';

export type DeskMode = 'contents' | 'notes';

export interface DeckKeys {
	pos: Position;
	go: (pos: Position) => void;
	/** open (or close) the contents or notes dialog; the presenter view has none */
	desk?: (mode: DeskMode) => void;
	/** a dialog is open: it has the keys */
	desk_open?: boolean;
	/** the route `p` opens the presenter window on */
	presenter?: (pos: Position) => string;
}

/**
 * The deck's keys, for the audience and presenter views. → and space step through a
 * scene's steps before moving on; ← steps back, landing on a scene's last step.
 * G or ? opens the contents, N the notes, F goes fullscreen, P opens the presenter window.
 */
export function handle_deck_key(e: KeyboardEvent, keys: DeckKeys) {
	if (e.metaKey || e.ctrlKey || e.altKey || e.defaultPrevented) return;
	const key = e.key.toLowerCase();

	if (keys.desk && (key === 'g' || key === '?' || key === 'n')) {
		e.preventDefault();
		keys.desk(key === 'n' ? 'notes' : 'contents');
		return;
	}

	if (keys.desk_open) return;
	// a control in a scene keeps its keys: space on a button, Home on a range…
	if (e.target instanceof Element && e.target.closest(CONTROL)) return;

	const { pos, go } = keys;
	switch (key) {
		case 'arrowright':
		case 'arrowdown':
		case 'pagedown':
		case ' ':
			go(e.shiftKey && key === ' ' ? prev(pos) : next(pos));
			break;
		case 'arrowleft':
		case 'arrowup':
		case 'pageup':
			go(prev(pos));
			break;
		case 'home':
			go({ n: 1, step: 0 });
			break;
		case 'end':
			go({ n: slides.length, step: 0 });
			break;
		case 'f':
			if (document.fullscreenElement) document.exitFullscreen();
			else document.documentElement.requestFullscreen?.().catch(() => {});
			break;
		case 'p':
			window.open(
				keys.presenter?.(pos) ?? href('/presenter/[slide]', pos),
				'presenter',
				'popup,width=1400,height=900'
			);
			break;
		default:
			return;
	}

	e.preventDefault();
}

/** a scene's address: `/migration`, `/breaks#2` for its third step */
export function href(route: '/[slide]' | '/presenter/[slide]', pos: Position): string {
	const id = slides[pos.n - 1]?.id ?? slides[0].id;
	return resolve(route, { slide: id }) + (pos.step ? `#${pos.step}` : '');
}

/** the step a URL is on: its hash, `/breaks#1` is that scene's second step */
export function step_from_hash(hash: string): number {
	return Number(hash.slice(1)) || 0;
}
