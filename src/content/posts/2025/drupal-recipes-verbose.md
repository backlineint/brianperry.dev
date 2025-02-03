---
title: Using Verbose Output When Applying Drupal Recipes
description: Verbose output gives a useful overview of the many steps happening behind the scenes when applying recipes.
author: Brian
date: 2025-02-02
tags:
  - drupal
---

I've been slowly chipping away at a side project that includes a set of related [Drupal Recipes](https://www.drupal.org/docs/extending-drupal/drupal-recipes). Given the repeatable nature of recipes, I apply them after a clean install frequently, and have a shell script that automates this process.

After some recent changes I found that one of my recipes was not applying cleanly. In an effort to debug, I ran the `drush recipe` command with the `-v` flag to get verbose output. Debugging aside, I found the output to be really useful.

Here's what I'd see when applying the `sanctuary_graphql` recipe without the verbose flag:

```shell
ddev drush recipe recipes/sanctuary_graphql
12/25 [▓▓▓▓▓▓▓▓▓▓▓▓▓░░░░░░░░░░░░░░░]
Installed Simple OAuth & OpenID Connect module.
25/25 [▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓]
Applied Sanctuary GraphQL recipe.

 [OK] Sanctuary GraphQL applied successfully
```

and this is the output with the `-v` flag:

```shell
ddev drush recipe recipes/sanctuary_graphql -v
 [info] Drush bootstrap phase: bootstrapDrupalRoot()
 [info] Change working directory to /var/www/html/web
 [info] Initialized Drupal 10.4.1 root directory at /var/www/html/web
 [info] Drush bootstrap phase: bootstrapDrupalSite()
 [info] Initialized Drupal site sanctuary.ddev.site at sites/default
 [info] Drush bootstrap phase: bootstrapDrupalConfiguration()
 [info] Drush bootstrap phase: bootstrapDrupalDatabase()
 [info] Successfully connected to the Drupal database.
 [info] Drush bootstrap phase: bootstrapDrupalFull()
 0/25 [░░░░░░░░░░░░░░░░░░░░░░░░░░░░]
Applying recipe
 [info] decoupled_preview_iframe module installed.
 3/25 [▓▓▓░░░░░░░░░░░░░░░░░░░░░░░░░]
Installed Config Pages module.
 5/25 [▓▓▓▓▓░░░░░░░░░░░░░░░░░░░░░░░]
Installed Paragraphs module.
 [info] paragraphs_edit module installed.
 8/25 [▓▓▓▓▓▓▓▓░░░░░░░░░░░░░░░░░░░░]
Installed Sanctuary module.
10/25 [▓▓▓▓▓▓▓▓▓▓▓░░░░░░░░░░░░░░░░░]
Installed Iconify Icons module.
 [info] menu_item_extras module installed.
 [info] simple_oauth module installed.
13/25 [▓▓▓▓▓▓▓▓▓▓▓▓▓▓░░░░░░░░░░░░░░]
15/25 [▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓░░░░░░░░░░░░]
Installed Typed Data module.
 [info] graphql module installed.
18/25 [▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓░░░░░░░░]
Installed Sanctuary GraphQL module.
20/25 [▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓░░░░░░]
Installed GraphQL Compose: Routes module.
 [info] graphql_compose_menus module installed.
25/25 [▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓]
Applied Sanctuary GraphQL recipe.

Modules installed
-----------------

 * Config Pages
 * Consumers
 * Decoupled Preview Iframe
 * Entity Reference Revisions
 * Frontend Editing
 * GraphQL
 * GraphQL Compose
 * GraphQL Compose: Edges
 * GraphQL Compose: Menus
 * GraphQL Compose: Preview
 * GraphQL Compose: Routes
 * Iconify Icons
 * Menu Item Extras
 * Paragraphs
 * Paragraphs Edit
 * Sanctuary
 * Sanctuary GraphQL
 * Serialization
 * Simple OAuth & OpenID Connect
 * Token
 * Typed Data

Recipes applied
---------------

 * Sanctuary Core
 * Sanctuary GraphQL


 [OK] Sanctuary GraphQL applied successfully
```

This is verbose (as advertised) but pretty essential information, especially if you're applying a recipe for the first time. Without -v all we really know is that the recipe was applied successfully. With -v we get a list of all of the modules installed, and also see that another recipe was applied as a dependency.

I'd often find myself either reviewing the source code of a recipe, or skimming the module page in the admin UI to understand what was actually included. This verbose output is a much quicker way to get that info.

From what I can tell, `-v` and `-vv` provide the same output. `-vvv` is more verbose, but I haven't found the extra info super useful as of yet. None of these options seem to provide debug output for config actions, which is the only thing I could see as a useful addition. (Update: there is an [open issue for this](https://www.drupal.org/project/distributions_recipes/issues/3459304).)

I realize that 'try running it with debug output' is hardly a groundbreaking tip, but in the case of recipes this additional info is really handy. Going forward, I'll be using `-v` by default when applying new recipes so that I can get a better sense of what's being added to my site.
