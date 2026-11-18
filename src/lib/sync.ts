// Keeps the audience window and the presenter window on the same slide.
// BroadcastChannel only reaches same-origin tabs in the same browser, which is all a talk needs.

type Message = { type: 'goto'; n: number };

const channel = typeof BroadcastChannel === 'undefined' ? null : new BroadcastChannel('deck');

export function broadcast(n: number) {
	channel?.postMessage({ type: 'goto', n } satisfies Message);
}

export function on_remote_goto(fn: (n: number) => void) {
	if (!channel) return () => {};
	const handler = (e: MessageEvent<Message>) => {
		if (e.data?.type === 'goto') fn(e.data.n);
	};
	channel.addEventListener('message', handler);
	return () => channel.removeEventListener('message', handler);
}
