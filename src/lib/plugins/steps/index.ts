// @mdsvex/plugin-steps, copied from the mdsvex repo (plugins/steps/src/index.ts) to run
// here before it is published, so the plugin API slide renders through the plugin it shows.
// Its components are the deck's own (./directives.ts), styled at stage size in app.css
import type { Bundle } from 'mdsvex/compile';

/** a heading depth written as a directive arg, undefined for anything else */
function level_of(arg: unknown): number | undefined {
	if (typeof arg !== 'string' || !/^[1-6]$/.test(arg)) return undefined;
	return Number(arg);
}

/**
 * numbered steps, each heading written directly inside `:::steps` starts a `step` that
 * holds the heading as its label and what follows it as its body. The first such heading
 * sets the depth that splits, `(level=3)` names it instead
 */
export function steps(): Bundle {
	return {
		name: 'steps',
		module: '#lib/plugins/steps/directives.ts',
		directives: {
			steps: {
				children: {
					heading(node, ctx) {
						const state = ctx.state;
						if (state.level === undefined) {
							state.level = level_of(ctx.directive.attrs.args?.level) ?? node.depth;
						}
						if (node.depth !== state.level) return;
						state.step?.close();
						state.step = node.wrap_from('directive_container', { name: 'step' });
						node.wrap_from('directive_label').close();
					}
				}
			},
			// no handlers, a step can also be written out as :::step[title]
			step: {}
		}
	};
}
