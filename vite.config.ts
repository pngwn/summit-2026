import adapter from '@sveltejs/adapter-auto';
import { sveltekit } from '@sveltejs/kit/vite';
import { mdsvex } from 'mdsvex';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [
		mdsvex({
			// registers both extensions with SvelteKit too, no need to repeat them below
			extensions: ['.md', '.svx'],

			// every slide is wrapped in a template; pick one per slide with `template:` in frontmatter
			templates: {
				default: '#lib/templates/Slide.svelte',
				title: '#lib/templates/TitleSlide.svelte',
				section: '#lib/templates/SectionSlide.svelte'
			},

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
