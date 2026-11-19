---
chapter: Streaming
name: Parsing a stream
size: small
rubric: Streaming
title: Parsing a stream.
notes: |
  Play or drag the range to inspect the document at each character. Every frame is mdsvex's
  own incremental parser, run in the browser right now, a character at a time.
  The heading appears as its text arrives. The emphasis shows dashed — a guess — until its
  closing _ arrives. The link shows as soon as its text starts, dashed too, since
  "[the docs" might never get its "](": it firms up when the url closes, and the strong
  does the same. The footnote reference is a number at once; its definition arrives last
  and lands at the foot.
  Scrub back across the "](" to show the link waiting.
---

::stream(example=arrives, speed=110)
