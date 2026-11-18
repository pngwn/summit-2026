---
name: A recipe blog
size: tiny
rubric: Examples · a recipe blog
title: Write it once, where it's used.
notes: |
  A recipe written in svx. Every ingredient is written in the method, where it is used:
  :ingredient[flour](qty=200, unit=g). The ingredients plugin claims the directive and adds
  each one to plugin_data; the recipe template lists them, summed by name — the butter is
  used twice and listed once — so the list can never drift from the method.
  Change the servings: the list and every quantity in the method scale together.
  The method is :::steps, the steps plugin from the plugin API slide.
  src/routes/sites/recipe/+page.svx
---

::::pair
:::sample[+page.svx]
````svx
---
template: recipe
serves: 4
---

:::steps
### Make the batter
Whisk :ingredient[plain flour](qty=200, unit=g)
and :ingredient[sugar](qty=1, unit=tbsp).

### Cook
Melt :ingredient[butter](qty=10, unit=g)…
:::
````
:::

:::sample[The page]
::site[sites/recipe](src=/sites/recipe)
:::
::::
