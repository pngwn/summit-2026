// The documents the streaming slides feed through the parser, and the plugins they use.
// A slide picks one by name: ::stream(example=arrives)
import type { ParsePlugin } from '@mdsvex/parse';

/**
 * a table of contents as @mdsvex/plugin-toc keeps one: each heading, once it closes and
 * its id is known, is added to the plugin's data, which a `::toc` component lists from
 */
export const toc: ParsePlugin = {
	name: 'toc',
	heading: {
		parse(node, ctx) {
			return () => ctx.add('headings', { id: node.attrs.id, text: node.text_content });
		}
	}
};

/**
 * marks every emphasis the moment it opens, before the parser is sure of it, and counts
 * it in its data. When the parser takes the emphasis back, the mark and the count go too
 */
export const marker: ParsePlugin = {
	name: 'marker',
	emphasis: {
		parse(node, ctx) {
			node.attrs.class = 'marked';
			ctx.add('marked', 'emphasis');
		}
	}
};

export interface Example {
	source: string;
	plugins?: ParsePlugin[];
}

export const examples: Record<string, Example> = {
	// the first scrub: a heading, emphasis, then a link, strong and a footnote arriving
	arrives: {
		source:
			'# The plan\n\nWin one _town_. Read [the docs](https://mdsvex.com) *first*.[^1]\n\n[^1]: Then the _source_.\n'
	},

	// a container directive: committed the moment its opening line ends
	container: {
		source: ':::note[Tip]\nStart with _one_ town,\nthen *the world*.\n:::\n'
	},

	// a plugin keeping a table of contents while the document arrives
	toc: {
		source:
			'## Install\nAdd the package.\n\n## Configure\nPut it in `plugins`.\n\n## Write\nStart small.\n',
		plugins: [toc]
	},

	// the parser holds back what it can't be sure of yet: a link waits for its url
	stall: { source: 'Read [the docs](/x) now.' },

	// a plugin acts on a guess, and the guess is taken back
	revoke: {
		source: 'Win _one_ town.\n\nWin _one town.\n\nDone.',
		plugins: [marker]
	}
};
