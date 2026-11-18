---
template: diff
name: Reference order
rubric: Ambiguity · link references
title: Define it before you use it.
steps: 3
notes: |
  Without the definition it is text. With a definition anywhere, even after it, it is a link.
  So no parser knows what it is until it has read the whole document.
  → PFM: the definition comes first, and the reference says it is one with [].
  A bare [docs] stays text. A streaming reader can resolve it as it arrives.
---

```markdown
Read the [docs].

<!-- 300 lines later -->

[docs]: https://mdsvex.com
```

```markdown
[docs]: https://mdsvex.com

Read the [docs][].
```

Is this a link?

It depends on a line you haven't read yet.

In PFM, defined first and referenced on purpose.
