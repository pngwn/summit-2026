// The streaming slides run mdsvex's own incremental pipeline, a character at a time:
// PFMParser → WireEmitter (the wire opcodes) → WireTreeBuilder with the plugins
// (PluginStream) → a snapshot of the tree. Nothing here is a recording: each frame is
// what the parser has said after exactly that many characters.
import { HeadingIds, heading_slug, PFMParser, WireEmitter } from '@mdsvex/parse';
import type { ParsePlugin } from '@mdsvex/parse';
import { Cursor } from '@mdsvex/parse/cursor';
import type { NodeBuffer } from '@mdsvex/parse/utils';
import { PluginStream } from '@mdsvex/render/stream';

/** NodeKind by number, as the wire's schema names them */
export const KINDS = [
	'root',
	'text',
	'html',
	'heading',
	'mustache',
	'code_fence',
	'line_break',
	'paragraph',
	'code_span',
	'emphasis',
	'strong_emphasis',
	'thematic_break',
	'link',
	'image',
	'block_quote',
	'list',
	'list_item',
	'hard_break',
	'soft_break',
	'strikethrough',
	'superscript',
	'subscript',
	'table',
	'table_header',
	'table_row',
	'table_cell',
	'html_comment',
	'svelte_tag',
	'svelte_block',
	'svelte_branch',
	'directive_inline',
	'directive_leaf',
	'directive_container',
	'frontmatter',
	'import_statement',
	'directive_label',
	'footnote_reference',
	'footnote_definition',
	'definition'
] as const;

export type Kind = (typeof KINDS)[number];

/** a node of the tree as it stood after a frame */
export interface TreeNode {
	/** its index in the buffer, stable while the node lives */
	index: number;
	kind: Kind;
	/** the parser opened it on a guess and may still take it back */
	pending: boolean;
	/** what the kind carries: a heading's depth, a list's order */
	extra: number;
	/** the text of a text node */
	text?: string;
	attrs?: Record<string, unknown>;
	children: TreeNode[];
}

/** one wire opcode, as sent */
export type Op = unknown[];

export interface Frame {
	/** how many characters the parser has been fed */
	fed: number;
	/** how far it has read for certain: fed minus cursor is the lookahead it holds */
	cursor: number;
	/** the opcodes this character produced, the schema left out */
	ops: Op[];
	tree: TreeNode[];
	/** what the plugins wrote, by plugin name */
	data: Record<string, Record<string, unknown>> | undefined;
}

/** the wire emitter, also keeping the cursor the parser reports */
class Recorder extends WireEmitter {
	at = 0;
	cursor(pos: number) {
		this.at = pos;
		super.cursor(pos);
	}
}

function snapshot(buf: NodeBuffer): TreeNode[] {
	const c = new Cursor(buf, '');
	const walk = (): TreeNode[] => {
		const out: TreeNode[] = [];
		do {
			const kind = KINDS[c.kind] ?? 'text';
			const node: TreeNode = {
				index: c.index,
				kind,
				pending: c.pending,
				extra: c.extra,
				children: []
			};
			// text, and the code of a code span, which it keeps as a value rather than a child
			if (kind === 'text' || kind === 'code_span') node.text = c.text();
			const meta = c.meta();
			if (meta && Object.keys(meta).length > 0) node.attrs = { ...meta };
			if (c.goto_first_child()) {
				node.children = walk();
				c.goto_parent();
			}
			out.push(node);
		} while (c.goto_next_sibling());
		return out;
	};
	return c.goto_first_child() ? walk() : [];
}

const copy = <T>(value: T): T => (value === undefined ? value : JSON.parse(JSON.stringify(value)));

/**
 * every frame of a document streamed a character at a time, then a last frame for the
 * end of input, where the parser settles what it was still unsure of
 */
export async function record(source: string, plugins: ParsePlugin[] = []): Promise<Frame[]> {
	const stream = new PluginStream({
		plugins,
		headings: new HeadingIds(heading_slug, () => false)
	});
	const emitter = new Recorder();
	const parser = new PFMParser(emitter);
	parser.init();
	const frames: Frame[] = [{ fed: 0, cursor: 0, ops: [], tree: [], data: undefined }];
	const take = (fed: number) => {
		const batch = emitter.flush() as Op[];
		stream.apply(batch);
		frames.push({
			fed,
			cursor: Math.min(emitter.at, fed),
			ops: batch.filter((op) => op[0] !== 'S'),
			tree: snapshot(stream.buffer),
			data: copy(stream.data.current) as Frame['data']
		});
	};
	for (let i = 0; i < source.length; i++) {
		emitter.set_source(source.slice(0, i + 1));
		parser.feed(source[i]);
		take(i + 1);
	}
	emitter.set_source(source);
	parser.finish();
	take(source.length);
	await stream.end();
	const last = frames[frames.length - 1];
	last.cursor = source.length;
	last.tree = snapshot(stream.buffer);
	last.data = copy(stream.data.current) as Frame['data'];
	return frames;
}

/** an opcode as a reader reads it: what it does, to which node, with what */
export function describe(op: Op): { verb: string; detail: string } {
	const [code, id] = op;
	switch (code) {
		case 'O': {
			const kind = KINDS[op[2] as number] ?? String(op[2]);
			return { verb: 'open', detail: `${kind} #${id}${op[4] ? ', pending' : ''}` };
		}
		case 'T':
			return { verb: 'text', detail: `#${id} ${JSON.stringify(op[2])}` };
		case 'A':
			return { verb: 'attr', detail: `#${id} ${op[2]}=${JSON.stringify(op[3])}` };
		case 'C':
			return { verb: 'close', detail: `#${id}` };
		case 'K':
			return { verb: 'commit', detail: `#${id}` };
		case 'R':
			return { verb: 'revoke', detail: `#${id} → ${JSON.stringify(op[2] ?? '')}` };
		case 'X':
			return { verb: 'clear', detail: `#${id}` };
		default:
			return { verb: String(code), detail: JSON.stringify(op.slice(1)) };
	}
}
