import adapter from '@sveltejs/adapter-auto';
import { sveltekit } from '@sveltejs/kit/vite';
import * as svx from '@twinkleplop/mdsvex';
import { mdsvex } from 'mdsvex';
import { ingredients } from './src/lib/plugins/ingredients/index.ts';
import { steps } from './src/lib/plugins/steps/index.ts';
import { travel } from './src/lib/plugins/travel/index.ts';
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
				journal: '#lib/templates/Journal.svelte',
				recipe: '#lib/templates/Recipe.svelte',
				tundra: '#lib/templates/Tundra.svelte'
			},

			// the directives scenes are written with: :::pair, :::sample[…], ::figure …
			components: '#lib/markdown.ts',

			// twinkleplop's svx grammar for PFM source: PFM's own rules, plus the script, style,
			// expressions and frontmatter of a document. ```markdown stays CommonMark's grammar,
			// for the CommonMark side of the comparisons
			highlight: { languages: { svx, pfm: 'svx' } },

			// the steps plugin, which the plugin API slide shows and renders through; the
			// ingredients and travel plugins, which the two minisites (src/routes/sites) use
			plugins: [steps(), ingredients(), travel()],

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
