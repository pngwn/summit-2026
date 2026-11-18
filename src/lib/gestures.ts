import { CONTROL } from '#lib/keys.ts';

export interface Gestures {
	back: () => void;
	forward: () => void;
	hold: () => void;
}

/**
 * Pointer controls for the stage, as an attachment. A tap on blank stage advances, or
 * goes back in the leftmost quarter. A horizontal swipe past 45 px moves (left advances);
 * vertical drags scroll. Holding a touch for 650 ms opens the contents. Controls, and a
 * tap that ends a text selection, keep the scene where it is.
 */
export function gestures(get: () => Gestures) {
	return (node: HTMLElement) => {
		let start: { x: number; y: number; id: number } | undefined;
		let hold: ReturnType<typeof setTimeout> | undefined;

		const cancel = () => {
			clearTimeout(hold);
			start = undefined;
		};

		const down = (e: PointerEvent) => {
			if (!e.isPrimary || e.button !== 0) return;
			if (e.target instanceof Element && e.target.closest(CONTROL)) return;
			start = { x: e.clientX, y: e.clientY, id: e.pointerId };
			if (e.pointerType === 'touch') {
				hold = setTimeout(() => {
					start = undefined;
					get().hold();
				}, 650);
			}
		};

		const move = (e: PointerEvent) => {
			if (start && Math.hypot(start.x - e.clientX, start.y - e.clientY) > 10) clearTimeout(hold);
		};

		const up = (e: PointerEvent) => {
			if (!start || e.pointerId !== start.id) return;
			const dx = e.clientX - start.x;
			const dy = e.clientY - start.y;
			cancel();
			const { back, forward } = get();
			if (Math.abs(dx) > 45 && Math.abs(dx) > 1.3 * Math.abs(dy)) {
				(dx < 0 ? forward : back)();
			} else if (Math.hypot(dx, dy) < 8 && !getSelection()?.toString()) {
				(e.clientX < innerWidth * 0.25 ? back : forward)();
			}
		};

		node.addEventListener('pointerdown', down);
		node.addEventListener('pointermove', move);
		window.addEventListener('pointerup', up);
		window.addEventListener('pointercancel', cancel);
		return () => {
			cancel();
			node.removeEventListener('pointerdown', down);
			node.removeEventListener('pointermove', move);
			window.removeEventListener('pointerup', up);
			window.removeEventListener('pointercancel', cancel);
		};
	};
}
