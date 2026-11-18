/** one line of a highlighted fence: its text, to compare, and its markup, to show */
export interface Line {
	text: string;
	html: string;
}

export interface DiffLine extends Line {
	/** `change`: one line whose only difference is at its end, diffed within the line */
	kind: 'same' | 'del' | 'add' | 'change';
	/** for a change, what the new line has after the old one's text: shown on the diff */
	tail?: string;
}

const escape = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/**
 * A deleted line followed by an added one that only replaces its trailing whitespace,
 * `roses are red␠␠` then `roses are red\`, becomes one changed line: the spaces strike
 * and the new end appears after them, in place. As two rows, the new line would need
 * a row of its own, which either pushes the lines below down or shows as a blank line
 * before the diff.
 */
export function inline_changes(lines: DiffLine[]): DiffLine[] {
	const out: DiffLine[] = [];
	for (let i = 0; i < lines.length; i++) {
		const [del, add, after] = [lines[i], lines[i + 1], lines[i + 2]];
		const kept = del.text.trimEnd();
		const alone = lines[i - 1]?.kind !== 'del' && after?.kind !== 'add';
		if (
			del.kind === 'del' &&
			add?.kind === 'add' &&
			alone &&
			kept.length > 0 &&
			kept !== del.text &&
			add.text.startsWith(kept) &&
			add.text.length > kept.length
		) {
			out.push({ ...del, kind: 'change', tail: escape(add.text.slice(kept.length)) });
			i++;
		} else out.push(lines[i]);
	}
	return out;
}

/**
 * A line diff of two fences, longest common subsequence first, then each gap between
 * matches as its deleted lines followed by its added ones, the order a reader expects.
 * Fences on a slide are a few lines long, so the quadratic table is nothing.
 */
export function diff_lines(a: Line[], b: Line[]): DiffLine[] {
	const n = a.length;
	const m = b.length;
	// lcs[i][j]: the longest common subsequence of a[i..] and b[j..]
	const lcs = Array.from({ length: n + 1 }, () => new Array<number>(m + 1).fill(0));
	for (let i = n - 1; i >= 0; i--) {
		for (let j = m - 1; j >= 0; j--) {
			lcs[i][j] =
				a[i].text === b[j].text ? lcs[i + 1][j + 1] + 1 : Math.max(lcs[i + 1][j], lcs[i][j + 1]);
		}
	}

	const out: DiffLine[] = [];
	let dels: DiffLine[] = [];
	let adds: DiffLine[] = [];
	const flush = () => {
		out.push(...dels, ...adds);
		dels = [];
		adds = [];
	};

	let i = 0;
	let j = 0;
	while (i < n || j < m) {
		if (i < n && j < m && a[i].text === b[j].text) {
			flush();
			out.push({ ...a[i], kind: 'same' });
			i++;
			j++;
		} else if (j >= m || (i < n && lcs[i + 1][j] >= lcs[i][j + 1])) {
			dels.push({ ...a[i++], kind: 'del' });
		} else {
			adds.push({ ...b[j++], kind: 'add' });
		}
	}
	flush();
	return out;
}

/** the lines of a fence mdsvex highlighted: a `<pre>` whose `<code>` holds one `.l` per line */
export function read_lines(pre: Element): Line[] {
	return [...pre.querySelectorAll(':scope > code > .l')].map((l) => ({
		text: l.textContent ?? '',
		html: l.innerHTML
	}));
}
