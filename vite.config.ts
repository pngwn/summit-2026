import adapter from '@sveltejs/adapter-auto';
import { sveltekit } from '@sveltejs/kit/vite';
import { mdsvex } from 'mdsvex';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [
		mdsvex({
			// registers both extensions with SvelteKit too, no need to repeat them below
			extensions: ['.md', '.svx'],

			// every scene is wrapped in a template, its layout family: pick one per scene with
			// `template:` in frontmatter
			templates: {
				default: '#lib/templates/Plate.svelte',
				plate: '#lib/templates/Plate.svelte',
				cover: '#lib/templates/Cover.svelte',
				verse: '#lib/templates/Verse.svelte',
				specimen: '#lib/templates/Specimen.svelte',
				diff: '#lib/templates/Diff.svelte',
				edition: '#lib/templates/Edition.svelte',
				tundra: '#lib/templates/Tundra.svelte'
			},

			// the directives scenes are written with: :::pair, :::sample[…], ::figure …
			components: '#lib/markdown.ts',

			// ```math fences and $`inline`$ math, rendered to MathML by Temml at build time
			math: {},

			// `--` → en dash, `---` → em dash, curly quotes
			smart_punctuation: true
		}),
		sveltekit({
			compilerOptions: {
				// Force runes mode for the project, except for libraries. Can be removed in svelte 6.
				runes: ({ filename }) =>
					filename.split(/[/\\]/).includes('node_modules') ? undefined : true
			},

			// adapter-auto only supports some environments, see https://svelte.dev/docs/kit/adapter-auto for a list.
			// If your environment is not supported, or you settled on a specific environment, switch out the adapter.
			// See https://svelte.dev/docs/kit/adapters for more information about adapters.
			adapter: adapter()
		})
	]
});
