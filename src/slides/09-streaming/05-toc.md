---
name: Plugins on a stream
size: small
rubric: Streaming · plugins
title: Plugins read along.
notes: |
  The same plugins run on a stream as on a compile. This is a toc plugin, as
  @mdsvex/plugin-toc keeps one: when a heading closes, its id and text are added to the
  plugin's data with ctx.add. The table of contents grows as the document arrives;
  a ::toc component reading plugin_data.toc would draw it live.
  heading(node, ctx) { return () => ctx.add('headings', { id, text }) }
---

::stream(example=toc, panels=toc)
