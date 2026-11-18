// The travel journal's plugin. `:::travel[Place](coords="lat,lon")` is a stop: the plugin
// claims the directive, and as each one closes adds its name and coordinates to its data,
// in document order. The journal's template draws the map from that data, so the map is
// whole on the server, before any script has run.
import type { Bundle } from 'mdsvex/compile';

export interface Stop {
	name: string;
	lat: number;
	lon: number;
}

export function travel(): Bundle {
	return {
		name: 'travel',
		module: '#lib/plugins/travel/directives.ts',
		directives: {
			travel: {
				// the directive itself; its label, the place's name, is known once it has closed
				parse(node, ctx) {
					return () => {
						const [lat, lon] = String(node.attrs.args?.coords ?? '')
							.split(',')
							.map(Number);
						const label = node.first_child;
						const name = label?.type === 'directive_label' ? label.text_content.trim() : '';
						if (Number.isFinite(lat) && Number.isFinite(lon)) {
							ctx.add('stops', { name, lat, lon } satisfies Stop);
						} else {
							ctx.warn('coords', `:::travel[${name}] needs coords="lat,lon"`, node);
						}
					};
				}
			}
		}
	};
}
