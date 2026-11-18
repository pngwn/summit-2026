# Summit 2026

Talk slides built with SvelteKit and [mdsvex next](https://next.mdsvex.pages.dev/docs).

```sh
pnpm dev        # http://localhost:5173
pnpm build      # prerenders every slide
```

## Writing slides

Each file in `src/slides/` is one slide, ordered by file name (`01-title.md`, `02-agenda.md`, …).

<!-- prettier-ignore -->
```md
---
title: Shown in the tab and presenter view
template: section # optional: default | title | section
notes: |
  Speaker notes, only visible in the presenter view.
---

import Thing from '#lib/components/Thing.svelte';

## A heading

Some *strong* and _emphasised_ text.

<Thing />
```

Templates live in `src/lib/templates/` and are registered in `vite.config.ts`.
Every frontmatter key is passed to the template as a prop.

`*.md` / `*.svx` are in `.prettierignore` because mdsvex next syntax isn't CommonMark
(`*strong*`, `_em_`, `{expressions}`), and prettier would rewrite it.

## Keys

| Key                            | Action                              |
| ------------------------------ | ----------------------------------- |
| `→` `↓` `Space` `PageDown`     | next slide                          |
| `←` `↑` `Shift+Space` `PageUp` | previous slide                      |
| `Home` / `End`                 | first / last slide                  |
| `f`                            | toggle fullscreen                   |
| `p`                            | open presenter view (synced window) |

Slides render on a fixed 1920×1080 canvas that is scaled to fit, so size things in `px`.
