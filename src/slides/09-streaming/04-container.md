---
name: Committed early
size: small
rubric: Streaming · directives
title: Committed at the first line.
notes: |
  A container directive is committed the moment its opening line ends: open
  directive_container, not pending. Its closing ::: hasn't arrived and may be pages away,
  but nothing can make the opener mean something else, so the box is drawn at once and
  everything inside streams into it.
  Compare the emphasis inside: that opens pending, dashed, until its closer arrives.
  This is the "stricter rules, less lookahead" payoff from the CommonMark section.
---

::stream(example=container, panels=ops)
