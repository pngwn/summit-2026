---
chapter: Examples
name: A travel journal
size: tiny
rubric: Examples
title: A travel journal.
notes: |
  A journal written in svx: each stop is a container directive, :::travel[Place] with its
  coordinates. The travel plugin claims the directive, and as each one closes adds its name
  and coordinates to plugin_data. The journal template draws the map from that data, so the
  whole map is there on the server, before any script runs.
  Scroll the right-hand side: as a stop reaches the middle of the screen, the penguin moves
  on, the dotted route is inked to it, and the place is labelled.
  Template, one directive, a plugin of twenty lines. src/routes/sites/travel/+page.svx
---

::::pair
:::sample[+page.svx]
````svx
---
template: journal
title: Going south
---

:::travel[Punta Tombo](coords="-44.05,-65.22")
Half a million Magellanic penguins…
:::

:::travel[Ushuaia](coords="-54.80,-68.30")
The end of the world has a post office.
:::
````
:::

:::sample[The page]
::site[sites/travel](src=/sites/travel)
:::
::::
