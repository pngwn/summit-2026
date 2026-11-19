---
chapter: Migration
name: Migrating from 0.x
rubric: Migration · layout becomes template
title: Migrating from 0.x.
notes: |
  Use migrate_config and migrate_document for the rewrites. check_template reports work
  in layout components. Walk through the frontmatter rename here, then mention how to
  review the migration notes.
---

::::pair
:::sample[Before]
```yaml
---
layout: blog
---
```
:::

:::sample[After]
```yaml
---
template: blog
---
```
:::
::::

The migrator rewrites documents and config, and flags the calls that need a human.
