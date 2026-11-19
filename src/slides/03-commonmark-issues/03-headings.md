---
template: diff
name: Headings
rubric: Many ways · headings
title: Three ways to write a heading.
notes: |
  ATX, ATX with closing hashes, and setext: CommonMark reads all three as the same h1.
  Setext also makes `---` mean two things: an h2 underline or a thematic break.
  → PFM: ATX only. Trailing hashes are heading text.
---

```markdown
# Heading

# Heading #

Heading
=======
```

```svx
# Heading
```

Three headings. All the same `<h1>`.

In PFM, one way. A closing `#` is just text.
