---
name: Holding back
size: small
rubric: Streaming · the wire
title: What it can't know yet, it holds.
notes: |
  The parser speaks in opcodes over a wire: open, text, attr, close, commit, revoke.
  The shaded source is what it has been fed but not yet read for certain: its lookahead.
  "Read " — the space is held: it could become part of something.
  "[the docs" opens a link at once, pending. Then "](/x" — nothing is sent at all until
  the ")" arrives, and then the href and the close land together.
  It never sends something it would have to contradict, except a pending guess, which it
  can take back. Next: what it commits to straight away.
---

::stream(example=stall, panels=ops, speed=260)
