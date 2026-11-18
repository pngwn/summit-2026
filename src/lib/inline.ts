/**
 * A line of frontmatter copy with PFM's inline marks: `_emphasis_`, `*strong*` and
 * `` `code` ``, as HTML. Titles live in frontmatter, where markdown isn't parsed,
 * and need only these. Everything else is escaped.
 */
export function inline(text: string): string {
	return text
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/`([^`]+)`/g, '<code>$1</code>')
		.replace(/(^|[\s(])_([^_]+)_(?=$|[\s.,;:!?)])/g, '$1<em>$2</em>')
		.replace(/(^|[\s(])\*([^*]+)\*(?=$|[\s.,;:!?)])/g, '$1<b>$2</b>');
}

/** a title as its lines, `[A fun, _fact._]` or one string, each a line of HTML */
export function lines(title: string | string[] | undefined): string {
	return (Array.isArray(title) ? title : [title ?? '']).map(inline).join('<br />');
}
