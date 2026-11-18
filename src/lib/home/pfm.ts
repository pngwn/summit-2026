// From the mdsvex site (packages/site/src/lib/design/pfm.ts), pfm_tree only.
// the real parser in the browser, so a score shows what mdsvex reads rather than
// a picture of it. From lib/experiments/pfm.ts on p/mdsvex-1.0-design, without
// pfm_html, which nothing in lib/design renders
import { parse_markdown_svelte } from '@mdsvex/parse';

/** the syntax choices the parser reads, mdsvex's `unwrap_images`; every one off by default */
export interface Syntax {
	unwrap_images?: boolean;
}

export interface PfmNode {
	type: string;
	start: number;
	end: number;
	/** the text of a leaf, like text and code */
	value?: string;
	/** where the content sits inside the node, a code span's code or a fence's lines */
	value_range?: [number, number];
	children?: PfmNode[];
	[key: string]: unknown;
}

/** the document as plain objects, the same tree the compile renders */
export function pfm_tree(source: string): PfmNode {
	const { nodes, source: normal } = parse_markdown_svelte(source);

	function build(index: number): PfmNode {
		const node = nodes.get_node(index);
		const out: PfmNode = { type: node.kind, start: node.start, end: node.end };

		// a list's start is its first number, it must not replace the offset
		for (const [key, value] of Object.entries(node.metadata ?? {})) {
			if (value !== undefined) out[key in out ? `meta_${key}` : key] = value;
		}
		out.value_range = node.value;

		if (node.children.length > 0) {
			out.children = node.children.map(build);
			return out;
		}

		// containers span their children, so only leaves show their text
		const [value_start, value_end] = node.value;
		if (value_end > value_start) out.value = normal.slice(value_start, value_end);
		return out;
	}

	return build(0);
}
