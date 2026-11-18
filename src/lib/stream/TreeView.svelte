<!--
	The tree after a frame, drawn as the page would show it. Nodes the parser opened on a
	guess (pending) are underlined in a dashed pink, so a guess reads as a guess; a class a
	plugin set is kept, so its marks show too. Links are spans: a click on stage must not
	navigate away from the deck.
-->
<script lang="ts">
	import type { TreeNode } from './engine.ts';
	import Self from './TreeView.svelte';

	let { nodes }: { nodes: TreeNode[] } = $props();

	const cls = (node: TreeNode) =>
		[node.kind, node.pending ? 'pending' : '', String(node.attrs?.class ?? '')]
			.filter(Boolean)
			.join(' ');
</script>

{#each nodes as node (node.index)}
	{#if node.kind === 'text'}{node.text}{:else if node.kind === 'paragraph'}<p class={cls(node)}>
			<Self nodes={node.children} />
		</p>{:else if node.kind === 'heading'}<div class="heading h{node.extra || 2} {cls(node)}">
			<Self nodes={node.children} />
		</div>{:else if node.kind === 'emphasis'}<em class={cls(node)}>
			<Self nodes={node.children} />
		</em>{:else if node.kind === 'strong_emphasis'}<strong class={cls(node)}>
			<Self nodes={node.children} />
		</strong>{:else if node.kind === 'link'}<span
			class="link {cls(node)}"
			data-href={node.attrs?.href}
		>
			<Self nodes={node.children} />
		</span>{:else if node.kind === 'code_span'}<code class={cls(node)}>
			{node.text ?? ''}
		</code>{:else if node.kind === 'footnote_reference'}<sup class={cls(node)}>
			{node.attrs?.number ?? node.attrs?.label ?? '1'}
		</sup>{:else if node.kind === 'footnote_definition'}<div class="footnote {cls(node)}">
			<span class="mark">{node.attrs?.number ?? node.attrs?.label ?? '1'}.</span>
			<Self nodes={node.children} />
		</div>{:else if node.kind === 'directive_container'}<aside class="note {cls(node)}">
			<Self nodes={node.children} />
		</aside>{:else if node.kind === 'directive_label'}<strong class="note-label {cls(node)}">
			<Self nodes={node.children} />
		</strong>{:else if node.kind === 'list'}<ul class={cls(node)}>
			<Self nodes={node.children} />
		</ul>{:else if node.kind === 'list_item'}<li class={cls(node)}>
			<Self nodes={node.children} />
		</li>{:else if node.kind === 'hard_break'}<br
		/>{:else if node.kind === 'soft_break'}{' '}{:else if node.kind === 'line_break'}{:else}<span
			class={cls(node)}
		>
			<Self nodes={node.children} />
		</span>{/if}
{/each}
