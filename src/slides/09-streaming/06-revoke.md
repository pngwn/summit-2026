---
name: Revoking a guess
size: small
rubric: Streaming · revocation
title: Revoking a guess undoes plugins.
notes: |
  A plugin that marks every emphasis the moment it opens, and counts it in its data:
  emphasis: { parse(node, ctx) { node.attrs.class = 'marked'; ctx.add('marked', ...) } }
  The first _one_ closes: the mark stays. The second _one never does: when its paragraph
  ends the parser revokes it ("revoke #10 → _"), and everything the plugin did for that
  node is undone with it, the class and the data entry. The plugin wrote no undo code.
---

::stream(example=revoke, panels="data ops", speed=170)
