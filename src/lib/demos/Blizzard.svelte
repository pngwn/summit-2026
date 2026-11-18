<!--
	A blizzard on a tundra, made only of mono glyphs on a board of pins, the technique of the
	mdsvex splash (media-generator experiments/2026-09-26-mdsvex-splash-v2) in paper and grey.

	Two WebGL2 passes, as the splash has them. The update pass works out what each pin should
	show (a falling flake, a gust's veil, spindrift over the drifts, the far ridge) and
	advances its flip: state ping-pongs between two float textures holding the current and
	target glyph, when the flip started, and its in-between glyph. The display pass draws
	each pin from a glyph atlas, squashing it shut and open again mid-flip.

	Snow falls on the slant in three depths: far flakes small, many and slow, near ones
	larger and quicker. The wind gusts on a slow cycle, slanting the veils across the sky and
	lifting spindrift off the ground. Pins with a flake on them crossfade rather than flip,
	so the snow moves smoothly. Reduced motion holds one still frame.
-->
<script lang="ts">
	let host: HTMLDivElement;
	let canvas: HTMLCanvasElement;
	let failed = $state(false);

	// glyphs: the board's alphabet, IBM Plex Mono, rendered once into an atlas
	const glyphs: string[] = [];
	const gid: Record<string, number> = {};
	const G = (ch: string) => {
		if (!(ch in gid)) {
			gid[ch] = glyphs.length;
			glyphs.push(ch);
		}
		return gid[ch];
	};
	[' ', ...'.·:\'`,-_~=+*×°/\\|;^"', '░', '▒'].forEach(G);
	const ids = (s: string) => [...s].map(G).join(',');

	const R = {
		SKY: ' .·:',
		VEIL: ".,'-~=",
		SNOW: ' .,_~',
		RIDGE: ' .·:',
		NOISE: "/\\|+-=*~:;'^",
		FAR: '.·',
		MID: '·+*',
		NEAR: '*×'
	};

	/** the ink: 16 steps from the paper to a soft charcoal */
	const PAPER = [251, 251, 248];
	const INK = [46, 49, 58];

	const COMMON = `#version 300 es
precision highp float; precision highp int; precision highp sampler2D;
uint pcg(uint v) { uint s = v * 747796405u + 2891336453u; uint w = ((s >> ((s >> 28u) + 4u)) ^ s) * 277803737u; return (w >> 22u) ^ w; }
float h2(vec2 p, float k) {
  ivec2 i = ivec2(floor(p)) + 65536;
  return float(pcg(uint(i.x) ^ pcg(uint(i.y) ^ pcg(uint(int(k) + 65536))))) / 4294967295.;
}
`;

	const UPDATE =
		COMMON +
		`
uniform sampler2D uPrev;
uniform vec2 uGrid;
uniform float uT, uAspect, uWind, uStill;
out vec4 o;

const int R_SKY[4] = int[4](${ids(R.SKY)});
const int R_SNOW[5] = int[5](${ids(R.SNOW)});
const int R_VEIL[6] = int[6](${ids(R.VEIL)});
const int R_RIDGE[4] = int[4](${ids(R.RIDGE)});
const int R_FAR[2] = int[2](${ids(R.FAR)});
const int R_MID[3] = int[3](${ids(R.MID)});
const int R_NEAR[2] = int[2](${ids(R.NEAR)});
const int NOISE[${R.NOISE.length}] = int[${R.NOISE.length}](${ids(R.NOISE)});
const int G_BLANK = ${G(' ')}, G_UNDER = ${G('_')};
const float HZ = .64;

int TG; float TL;

float vnoise(vec2 p) {
  vec2 i = floor(p), f = fract(p), u = f * f * (3. - 2. * f);
  float a = h2(i, 7.), b = h2(i + vec2(1, 0), 7.), c = h2(i + vec2(0, 1), 7.), d = h2(i + 1., 7.);
  return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
}
float fbm(vec2 p) { return vnoise(p) * .57 + vnoise(p * 2.03 + vec2(17.1, -3.7)) * .29 + vnoise(p * 4.1 + vec2(-9.2, 5.3)) * .14; }

// a flake on this pin, nearest depth first; the wind slants them and speeds them up
bool flakes(float c, float r) {
  for (int k = 2; k >= 0; k--) {
    float fk = float(k);
    float slope = (.45 + fk * .25) * (.55 + .9 * uWind);
    float speed = (.07 + fk * .07) * (.75 + .6 * uWind);
    float wob = sin(r * (.19 + fk * .05) + uT * (1.1 + fk * .4) + fk * 2.1) * (.5 + fk * .3);
    float lane = floor(c - r * slope * uAspect * .6 + wob);
    float dens = (k == 0 ? .95 : k == 1 ? .6 : .3) * (.7 + .5 * uWind);
    if (h2(vec2(lane, 7. + fk), 0.) > dens) continue;
    float period = uGrid.y * ((k == 0 ? .12 : k == 1 ? .2 : .32) + h2(vec2(lane, 3. + fk), 0.) * .5);
    float y = mod(r - uT * speed * uGrid.y - h2(vec2(lane, 11. + fk), 0.) * 999., period);
    if (y < 1.) {
      float pick = h2(vec2(lane, 19. + fk), 0.);
      if (k == 0) { TG = R_FAR[int(pick * 2.)]; TL = 6. + pick * 2.; }
      else if (k == 1) { TG = R_MID[int(pick * 3.)]; TL = 9. + pick * 2.; }
      else { TG = R_NEAR[int(pick * 2.)]; TL = 12. + pick * 3.; }
      return true;
    }
  }
  return false;
}

void scene(float c, float r) {
  float nx = c / uGrid.x, ny = r / uGrid.y;
  // a per-pin threshold, random rather than ordered, so nothing lines up into rows
  float dith = h2(vec2(c, r), 5.);
  float slope = (.5 + .9 * uWind) * .35;
  // the far ridge, low and broken, just above the horizon
  float ridge = HZ - .012 - fbm(vec2(nx * 3.1, 1.7)) * .06 * smoothstep(.0, .25, fbm(vec2(nx * 1.3, 4.2)));

  if (ny < ridge) {
    float k = ny / ridge;
    // veils of driven snow: noise stretched along the wind's slant and streaming with it
    vec2 q = vec2(nx - ny * slope, ny + nx * .12);
    float veil = fbm(vec2(q.x * 1.6 - uT * (.05 + .2 * uWind), q.y * 9.));
    veil = smoothstep(.46, .82, veil) * (.45 + .7 * uWind);
    if (veil > dith * .9 + .08) {
      TG = R_VEIL[clamp(int(veil * 4. + h2(vec2(c, r), floor(uT * 3.)) * 2.), 0, 5)];
      TL = 3.5 + veil * 6.;
      return;
    }
    // otherwise mostly white-out: haze only where the drifting cloud thickens
    float v = (fbm(vec2(nx * 2.2 - uT * .04 * uWind, ny * 3.5 + uT * .01)) - .45) * 1.1 + k * k * .08;
    if (v > dith * .6) { TG = R_SKY[1 + int(h2(vec2(c, r), 13.) * 2.)]; TL = 2.5 + v * 7.; return; }
    TG = R_SKY[0]; TL = 0.;
    return;
  }

  if (ny < HZ) {
    float v = .2 + fbm(vec2(nx * 9., ny * 20.)) * .45;
    if (v < dith * .7) { TG = R_RIDGE[0]; TL = 0.; return; }
    TG = R_RIDGE[clamp(int(v * 4.), 1, 3)];
    TL = 3. + v * 4.;
    return;
  }

  if ((ny - HZ) * uGrid.y < 1.) { TG = dith < .8 ? G_UNDER : G_BLANK; TL = 8.; return; }

  // the plain: drifts and wind-cut ridges in perspective, spindrift blowing low over them
  float z = (ny - HZ) / (1. - HZ);
  float dep = 1. / (ny - HZ + .03);
  float drift = fbm(vec2(nx * 3.5 / (.35 + z), dep * .12));
  float ridges = .5 + .5 * sin(dep * 1.3 + nx * 2.4 + drift * 5.);
  float spin = fbm(vec2((nx - ny * slope * .4) * 2.2 * (1. + z) - uT * (.08 + .45 * uWind), dep * .3 + uT * .04));
  spin = smoothstep(.48, .85, spin) * (.3 + .8 * uWind) * (1. - z * .45);
  if (spin > dith * .8 + .08) { TG = R_VEIL[clamp(int(spin * 4. + h2(vec2(c, r), floor(uT * 4.)) * 2.), 0, 5)]; TL = 3.5 + spin * 6.; return; }
  // bare snow, with the crest of a ridge marked here and there
  float v = ridges * ridges * ridges * (.5 + .5 * z) + drift * .25 - .18;
  if (v < dith * .55) { TG = G_BLANK; TL = 0.; return; }
  TG = R_SNOW[clamp(1 + int(v * 3. + h2(vec2(c, r), 17.) * 1.5), 1, 4)];
  TL = 3. + v * 9.;
}

void main() {
  ivec2 ci = ivec2(gl_FragCoord.xy);
  float c = float(ci.x), r = float(ci.y);
  vec4 s = texelFetch(uPrev, ci, 0);

  // the first time in, pins flip into the scene outward from the middle
  float dist = length(vec2((c / uGrid.x - .5) * uGrid.x, (r / uGrid.y - .45) * uGrid.y * uAspect))
    / length(vec2(uGrid.x * .5, uGrid.y * uAspect * .55));
  float reveal = uStill > .5 ? -1. : .15 + dist * 1.4 + h2(vec2(c, r), 9.) * .45;

  TG = G_BLANK; TL = 0.;
  bool mine = false;
  if (uT >= reveal) {
    mine = flakes(c, r);
    if (!mine) scene(c, r);
  }
  int TC = int(clamp(TL, 0., 15.));

  // state: x current, y target, z flip start or negative hold end, w packs mid glyph, flags, duration
  float cur = s.x, to = s.y, t0 = s.z;
  float mid1 = mod(s.w, 100.), bits = mod(floor(s.w / 100.), 10.), dur = floor(s.w / 1000.) / 1000.;
  bool fade = bits > 1.5;
  float hh = h2(vec2(c, r), 3.);
  if (t0 >= 0. && uT - t0 >= dur) { cur = to; t0 = -(uT + (fade ? 0. : .03 + hh * .08)); mid1 = 0.; fade = false; }
  if (t0 < 0. && uT >= -t0) {
    int curG = int(cur) / 128;
    if (TG != curG || int(cur) % 128 != TC) {
      to = float(TG * 128 + TC);
      // flakes, and a pin a flake leaves, crossfade; the land flips, now and then through a noise glyph
      bool soft = mine || curG == R_FAR[0] || curG == R_FAR[1] || curG == R_MID[0] || curG == R_MID[1] || curG == R_MID[2] || curG == R_NEAR[0] || curG == R_NEAR[1] || TG == curG;
      bool useMid = !soft && h2(vec2(c, r), floor(uT * 60.)) < .1;
      int mid = useMid ? NOISE[int(h2(vec2(r, c), floor(uT * 37.)) * ${R.NOISE.length}.)] : -1;
      mid1 = float(mid + 1);
      fade = soft;
      dur = soft ? .07 : (useMid ? .2 : .11) + h2(vec2(r, c), 1.) * .06;
      t0 = uT;
      if (uStill > .5) { cur = to; t0 = -uT; }
    }
  }
  o = vec4(cur, to, t0, mid1 + 100. * (fade ? 2. : 0.) + 1000. * floor(dur * 1000. + .5));
}`;

	const DISPLAY =
		COMMON +
		`
uniform sampler2D uState, uAtlas;
uniform vec2 uGrid, uRes, uCell;
uniform float uT;
uniform vec3 uPaper, uInk;
out vec4 o;
float glyph(int g, vec2 lp, float sc) {
  if (g == 0) return 0.;
  float sy = uCell.y * .5 + (lp.y - uCell.y * .5) / sc;
  if (sy < 0. || sy >= uCell.y) return 0.;
  return texelFetch(uAtlas, ivec2(g * int(uCell.x) + int(lp.x), int(sy)), 0).r;
}
vec3 pal(int c) { return mix(uPaper, uInk, pow(float(c) / 15., 1.15)); }
void main() {
  vec2 p = vec2(gl_FragCoord.x, uRes.y - gl_FragCoord.y);
  ivec2 ci = ivec2(floor(p / uCell));
  float grain = (h2(gl_FragCoord.xy, floor(uT * 24.)) - .5) * .018;
  vec3 BG = uPaper;
  if (ci.x >= int(uGrid.x) || ci.y >= int(uGrid.y)) { o = vec4(BG + grain, 1); return; }
  vec2 lp = p - vec2(ci) * uCell;
  vec4 s = texelFetch(uState, ci, 0);
  int A = int(s.x), B = int(s.y);
  float dur = floor(s.w / 1000.) / 1000.;
  vec3 col = BG;
  float ink = 0.;
  if (s.z >= 0. && dur > 0.) {
    float pr = clamp((uT - s.z) / dur, 0., 1.);
    if (mod(floor(s.w / 100.), 10.) > 1.5) {
      float a = glyph(A / 128, lp, 1.) * (1. - pr), b = glyph(B / 128, lp, 1.) * pr;
      col += (pal(A % 128) - BG) * a + (pal(B % 128) - BG) * b;
      ink = a + b;
    } else {
      // a flip squashes the old glyph shut, then opens the new one
      int mid = int(mod(s.w, 100.)) - 1;
      if (mid >= 0) {
        int mc = max(0, B % 128 - 2);
        if (pr < .5) { B = mid * 128 + mc; pr *= 2.; } else { A = mid * 128 + mc; pr = pr * 2. - 1.; }
      }
      float sc = max(.12, abs(cos(pr * 3.14159)));
      int cur = pr < .5 ? A : B;
      ink = glyph(cur / 128, lp, sc);
      col += (pal(cur % 128) - BG) * ink * (.6 + .4 * sc);
    }
  } else {
    ink = glyph(A / 128, lp, 1.);
    col += (pal(A % 128) - BG) * ink;
  }
  // an empty pin shows its socket, a faint dot, so the board reads as a board
  if (ink < .1 && length(lp - uCell * .5) < max(.8, uCell.x * .06)) col = mix(BG, uInk, .06);
  o = vec4(col + grain, 1);
}`;

	const VERT = `#version 300 es
in vec2 p; void main() { gl_Position = vec4(p, 0, 1); }`;

	$effect(() => {
		// ?capture keeps the frame readable, for recording the scene or checking it headless
		const capture = new URLSearchParams(location.search).has('capture');
		const gl = canvas.getContext('webgl2', {
			antialias: false,
			alpha: false,
			preserveDrawingBuffer: capture
		});
		if (!gl || !gl.getExtension('EXT_color_buffer_float')) {
			failed = true;
			return;
		}

		function program(fs: string) {
			const p = gl!.createProgram()!;
			for (const [type, src] of [
				[gl!.VERTEX_SHADER, VERT],
				[gl!.FRAGMENT_SHADER, fs]
			] as const) {
				const sh = gl!.createShader(type)!;
				gl!.shaderSource(sh, src);
				gl!.compileShader(sh);
				if (!gl!.getShaderParameter(sh, gl!.COMPILE_STATUS))
					throw new Error(gl!.getShaderInfoLog(sh) ?? 'shader');
				gl!.attachShader(p, sh);
			}
			gl!.bindAttribLocation(p, 0, 'p');
			gl!.linkProgram(p);
			if (!gl!.getProgramParameter(p, gl!.LINK_STATUS))
				throw new Error(gl!.getProgramInfoLog(p) ?? 'link');
			const u: Record<string, WebGLUniformLocation | null> = {};
			const n = gl!.getProgramParameter(p, gl!.ACTIVE_UNIFORMS);
			for (let i = 0; i < n; i++) {
				const name = gl!.getActiveUniform(p, i)!.name;
				u[name] = gl!.getUniformLocation(p, name);
			}
			return { p, u };
		}

		const update = program(UPDATE);
		const display = program(DISPLAY);

		const quad = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, quad);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
		gl.enableVertexAttribArray(0);
		gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);

		const REDUCED = matchMedia('(prefers-reduced-motion: reduce)').matches;
		let grid = { x: 0, y: 0 };
		let cell = { w: 0, h: 0 };
		let state: { tex: WebGLTexture; fb: WebGLFramebuffer }[] = [];
		let atlas: WebGLTexture | null = null;
		let flip = 0;
		let start = performance.now();
		let frame = 0;
		let still = 0;

		function texture(w: number, h: number) {
			const tex = gl!.createTexture()!;
			gl!.bindTexture(gl!.TEXTURE_2D, tex);
			gl!.texImage2D(gl!.TEXTURE_2D, 0, gl!.RGBA32F, w, h, 0, gl!.RGBA, gl!.FLOAT, null);
			for (const k of [gl!.TEXTURE_MIN_FILTER, gl!.TEXTURE_MAG_FILTER])
				gl!.texParameteri(gl!.TEXTURE_2D, k, gl!.NEAREST);
			const fb = gl!.createFramebuffer()!;
			gl!.bindFramebuffer(gl!.FRAMEBUFFER, fb);
			gl!.framebufferTexture2D(gl!.FRAMEBUFFER, gl!.COLOR_ATTACHMENT0, gl!.TEXTURE_2D, tex, 0);
			// every pin starts blank and settled
			gl!.clearColor(0, 0, -0.001, 0);
			gl!.clear(gl!.COLOR_BUFFER_BIT);
			return { tex, fb };
		}

		function build_atlas() {
			const c = document.createElement('canvas');
			c.width = cell.w * glyphs.length;
			c.height = cell.h;
			const g = c.getContext('2d')!;
			g.fillStyle = '#fff';
			g.textAlign = 'center';
			g.textBaseline = 'alphabetic';
			g.font = `${Math.min(cell.h * 0.78, (cell.w / 0.6) * 0.98)}px "IBM Plex Mono", ui-monospace, monospace`;
			glyphs.forEach((ch, i) => {
				g.save();
				g.beginPath();
				g.rect(i * cell.w, 0, cell.w, cell.h);
				g.clip();
				if (ch === '░' || ch === '▒') {
					// drawn shades: a sparse or denser stipple, clipped to the pin
					const every = ch === '░' ? 3 : 2;
					for (let y = 0; y < cell.h; y++)
						for (let x = 0; x < cell.w; x++)
							if ((x + y * 2) % every === 0 && (y % every === 0 || every === 2))
								g.fillRect(i * cell.w + x, y, 1, 1);
				} else g.fillText(ch, i * cell.w + cell.w / 2, cell.h * 0.74);
				g.restore();
			});
			const data = g.getImageData(0, 0, c.width, c.height).data;
			const red = new Uint8Array(c.width * c.height);
			for (let i = 0; i < red.length; i++) red[i] = data[i * 4];
			if (atlas) gl!.deleteTexture(atlas);
			atlas = gl!.createTexture();
			gl!.bindTexture(gl!.TEXTURE_2D, atlas);
			gl!.pixelStorei(gl!.UNPACK_ALIGNMENT, 1);
			gl!.texImage2D(
				gl!.TEXTURE_2D,
				0,
				gl!.R8,
				c.width,
				c.height,
				0,
				gl!.RED,
				gl!.UNSIGNED_BYTE,
				red
			);
			for (const k of [gl!.TEXTURE_MIN_FILTER, gl!.TEXTURE_MAG_FILTER])
				gl!.texParameteri(gl!.TEXTURE_2D, k, gl!.NEAREST);
		}

		function resize() {
			const dpr = Math.min(2, devicePixelRatio || 1);
			const w = Math.max(1, Math.round(host.clientWidth * dpr));
			const h = Math.max(1, Math.round(host.clientHeight * dpr));
			canvas.width = w;
			canvas.height = h;
			// about 200 pins across whatever the screen, so a preview is the same scene, smaller
			const cw = Math.max(3, Math.round(w / 200));
			cell = { w: cw, h: Math.round(cw * 1.7) };
			grid = { x: Math.ceil(w / cell.w), y: Math.ceil(h / cell.h) };
			for (const s of state) {
				gl!.deleteTexture(s.tex);
				gl!.deleteFramebuffer(s.fb);
			}
			state = [texture(grid.x, grid.y), texture(grid.x, grid.y)];
			build_atlas();
			start = performance.now();
			still = 0;
		}

		/** the wind: a slow swell with gusts riding on it, 0 to 1 */
		const wind = (t: number) =>
			Math.min(
				1,
				Math.max(
					0.15,
					0.55 + 0.25 * Math.sin(t * 0.09) + 0.3 * Math.pow(Math.max(0, Math.sin(t * 0.31 + 1)), 3)
				)
			);

		function draw() {
			const t = REDUCED ? 40 : (performance.now() - start) / 1000;
			const [from, to] = flip ? [state[1], state[0]] : [state[0], state[1]];

			gl!.useProgram(update.p);
			gl!.bindFramebuffer(gl!.FRAMEBUFFER, to.fb);
			gl!.viewport(0, 0, grid.x, grid.y);
			gl!.activeTexture(gl!.TEXTURE0);
			gl!.bindTexture(gl!.TEXTURE_2D, from.tex);
			gl!.uniform1i(update.u.uPrev, 0);
			gl!.uniform2f(update.u.uGrid, grid.x, grid.y);
			gl!.uniform1f(update.u.uT, t);
			gl!.uniform1f(update.u.uAspect, cell.h / cell.w);
			gl!.uniform1f(update.u.uWind, wind(t));
			gl!.uniform1f(update.u.uStill, REDUCED ? 1 : 0);
			gl!.drawArrays(gl!.TRIANGLE_STRIP, 0, 4);
			flip ^= 1;

			gl!.useProgram(display.p);
			gl!.bindFramebuffer(gl!.FRAMEBUFFER, null);
			gl!.viewport(0, 0, canvas.width, canvas.height);
			gl!.activeTexture(gl!.TEXTURE0);
			gl!.bindTexture(gl!.TEXTURE_2D, to.tex);
			gl!.uniform1i(display.u.uState, 0);
			gl!.activeTexture(gl!.TEXTURE1);
			gl!.bindTexture(gl!.TEXTURE_2D, atlas);
			gl!.uniform1i(display.u.uAtlas, 1);
			gl!.uniform2f(display.u.uGrid, grid.x, grid.y);
			gl!.uniform2f(display.u.uRes, canvas.width, canvas.height);
			gl!.uniform2f(display.u.uCell, cell.w, cell.h);
			gl!.uniform1f(display.u.uT, t);
			gl!.uniform3f(display.u.uPaper, PAPER[0] / 255, PAPER[1] / 255, PAPER[2] / 255);
			gl!.uniform3f(display.u.uInk, INK[0] / 255, INK[1] / 255, INK[2] / 255);
			gl!.drawArrays(gl!.TRIANGLE_STRIP, 0, 4);

			// under reduced motion the scene settles in a couple of frames and stays put
			if (REDUCED && ++still > 2) return;
			frame = requestAnimationFrame(draw);
		}

		let alive = true;
		const begin = () => {
			if (!alive) return;
			resize();
			cancelAnimationFrame(frame);
			// draw at once: a resized canvas is cleared, and would show black until the next frame
			draw();
		};
		// the atlas needs the mono face loaded, or it bakes in the fallback
		document.fonts.load('16px "IBM Plex Mono"').then(begin, begin);
		const ro = new ResizeObserver(() => {
			if (atlas) begin();
		});
		ro.observe(host);

		return () => {
			alive = false;
			cancelAnimationFrame(frame);
			ro.disconnect();
			gl.getExtension('WEBGL_lose_context')?.loseContext();
		};
	});
</script>

<div class="blizzard" bind:this={host} aria-hidden="true">
	<canvas bind:this={canvas} class:failed></canvas>
</div>

<style>
	.blizzard {
		position: absolute;
		inset: 0;
		overflow: hidden;
		background: var(--paper);
	}

	canvas {
		display: block;
		width: 100%;
		height: 100%;
	}

	canvas.failed {
		display: none;
	}
</style>
