---
title: It depends
kicker: Link references
notes: |
  Without the definition it is text. With a definition anywhere, even after it, it is a link.
  So no parser can know what it is until it has read the whole document.
---

```markdown
Read the [docs].

<!-- 300 lines later -->

[docs]: https://mdsvex.com
```

It depends on a line you haven't read yet.
