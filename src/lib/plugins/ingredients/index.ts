// The recipe blog's plugin. An ingredient is written where the method uses it,
// `:ingredient[flour](qty=200, unit=g)`, and the plugin adds each one to its data in
// document order. The recipe's template lists them, summed by name, so the ingredients
// list can never drift from the method; and both scale with the servings.
import type { Bundle } from 'mdsvex/compile';

export interface Ingredient {
	name: string;
	qty: number;
	unit: string;
}

export function ingredients(): Bundle {
	return {
		name: 'ingredients',
		module: '#lib/plugins/ingredients/directives.ts',
		directives: {
			ingredient: {
				// the directive itself; its label, the ingredient, is known once it has closed
				parse(node, ctx) {
					return () => {
						const args = node.attrs.args ?? {};
						ctx.add('items', {
							name: node.text_content.trim(),
							qty: Number(args.qty ?? 1) || 0,
							unit: String(args.unit ?? '')
						} satisfies Ingredient);
					};
				}
			}
		}
	};
}
