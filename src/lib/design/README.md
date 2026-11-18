# lib/design

Copied from the mdsvex site on the `next` branch (`packages/site/src/lib/design`), so the slides
print on the same paper with the same inks:

| file                        | from the site, changed                         |
| --------------------------- | ---------------------------------------------- |
| `tokens.css`                | as is: paper, ink, quiet, the riso inks        |
| `type.css`, `fonts.ts`      | as is: Playfair, Source Serif 4, Berkeley Mono |
| `texture.ts`, `texture.css` | as is: linen, riso and the ragged edge         |
| `code.css`                  | `.design-frame` is `.deck` here                |

Berkeley Mono is found with `local()` only; with it missing, IBM Plex Mono stands in.
When the site's copies change, copy them again rather than editing these.
