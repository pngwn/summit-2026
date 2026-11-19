---
template: diff
name: An invisible hard break
rubric: Invisible syntax · line breaks
title: Hard line breaks.
steps: 3
reveal: 1
notes: |
  Two spaces at the end of a line. Editors and formatters trim trailing whitespace,
  so the break disappears without anyone touching it. Reveal them.
  → PFM: CommonMark already allows a backslash; PFM removes the trailing-space form.
---

```markdown
roses are red  
violets are blue
```

```svx
roses are red\
violets are blue
```

There's a line break in here. Can you see it?

Two trailing spaces. Your editor trims them.

In PFM, a backslash. You can see it.
