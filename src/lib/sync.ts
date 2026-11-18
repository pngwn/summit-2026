// Keeps the audience window and the presenter window on the same slide and step.
// BroadcastChannel only reaches same-origin tabs in the same browser, which is all a talk needs.

import type { Position } from '#lib/deck.ts';

type Message = { type: 'goto' } & Position;

const channel = typeof BroadcastChannel === 'undefined' ? null : new BroadcastChannel('deck');

export function broadcast(pos: Position) {
	channel?.postMessage({ type: 'goto', ...pos } satisfies Message);
}

export function on_remote_goto(fn: (pos: Position) => void) {
	if (!channel) return () => {};
	const handler = (e: MessageEvent<Message>) => {
		if (e.data?.type === 'goto') fn({ n: e.data.n, step: e.data.step ?? 0 });
	};
	channel.addEventListener('message', handler);
	return () => channel.removeEventListener('message', handler);
}
