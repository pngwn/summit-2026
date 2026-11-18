---
chapter: Plugins
name: First-party plugins
size: small
rubric: Plugin system · first party
title: One line each.
notes: |
  The first-party plugins are packages of their own, @mdsvex/plugin-*. Each exports a
  function, and what it returns goes in the plugins option, in the order they should run.
  A plugin can bring directives with the components that render them, act on nodes as the
  document is parsed, and do work at compile time. The docs read every plugin from its
  package: its name, what it owns, its options. Point at two or three that matter to you.
---

::::::pair(cols=wide)
:::::sample[vite.config.js]
```js
import { tabs } from '@mdsvex/plugin-tabs';
import { toc } from '@mdsvex/plugin-toc';

mdsvex({ plugins: [tabs(), toc()] });
```
:::::

:::::sample[@mdsvex/plugin-*]
:::columns(count=2)
- anchors
- callouts
- citations
- code-blocks
- diagrams
- elements
- embeds
- emoji
- external-links
- figures
- link-check
- numbering
- page-data
- references
- steps
- tabs
- toc
:::
:::::
::::::
