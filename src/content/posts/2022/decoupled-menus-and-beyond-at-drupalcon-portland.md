---
title: Decoupled Menus (and Beyond) at DrupalCon Portland
description: Lots of exciting work to do and news to share related to the
  Decoupled Menus Initiative and Decoupled Drupal in general. Here's what I'll
  be focusing on in Portland at DrupalCon.
author: Brian
date: 2022-04-19T13:21:43.322Z
tags:
  - drupal
---

DrupalCon Portland is almost here! Getting back to an in-person DrupalCon will take some getting used to, but I'm especially excited for the ability to collaborate face-to-face during contribution events throughout the week. There is quite a bit going on in the world of Decoupled Drupal - here are some of the things I plan on focusing on...

## Decoupled Menus Initiative

We’re aiming to get a point where we can declare this specific initiative complete and could use help in a few specific focus areas.

- [Migrating the decoupled menus linkset endpoint to Drupal Core](https://www.drupal.org/project/drupal/issues/3227824) - we're very close to getting this functionality included in core, but will still likely need some final assistance at DrupalCon.

- Documentation improvements - first and foremost, we need to [finalize the documentation specific to the new decoupled menus endpoint](https://www.drupal.org/project/decoupled_menus_initiative/issues/3263181). We have made good progress there and mostly just need to incorporate some proposed revisions. We've also [migrated the existing Decoupled Drupal documentation](https://www.drupal.org/project/decoupled_menus_initiative/issues/3265903) to [a new home within the main Drupal Developer docs](https://www.drupal.org/docs/develop/decoupled-drupal). There is a huge opportunity to flesh out the overall documentation for Decoupled Drupal, and [hopefully this will evolve into a focused effort](https://www.drupal.org/project/documentation/issues/3276081) beyond the Decoupled Menus Initiative.

- Decoupled Menu Parser - the [Decoupled Menus Parser](https://www.drupal.org/project/decoupled_menu_parser) is a JavaScript library to simplify consuming data from the new decoupled menus endpoint. There are [a few open issues](https://www.drupal.org/project/issues/decoupled_menu_parser?categories=All) to update the library due to recent adjustments to the API response.

## Drupal State

- [Drupal State and the Need for a JavaScript SDK](https://events.drupal.org/portland2022/sessions/drupal-state-and-need-javascript-sdk) - bright and early Thursday morning I'll be presenting both about the Drupal State project, and perhaps more importantly my belief that an official JavaScript SDK is important for the future of Drupal.

Drupal State also has a healthy [issue queue](https://www.drupal.org/project/issues/drupal_state?categories=All), so if you're interested in contributing or learning more about the project, I'll be around during the contribution events.

## Generic Drupal Web Components

This project has had a long and winding road. Initially created in support of the Decoupled Menus hackathon at last year's DrupalCon, [Generic Drupal Web Components (GDWC)](https://www.drupal.org/project/gdwc) aims to create a set of web components that can work well with data sourced from Drupal. But as you'll hear in my talk, finding a better solution to source data from Drupal resulted in the considerable tangent that was the creation of the Drupal State project.

There is [an in-progress issue for GDWC](https://www.drupal.org/project/gdwc/issues/3276122) that introduces two new components that can be used to make Drupal data available to any web components. I think this has the potential to open the floodgates for future components. I'd love to hear your thoughts.

## Pantheon

That's a lot of stuff! I'll also be around the Pantheon booth and would be happy to talk about these projects, or anything relevant to decoupled Drupal on [Pantheon](https://pantheon.io/). I'll also be at [the Pantheon DrupalCon Party](https://www.eventbrite.com/e/the-unofficial-official-drupalcon22-party-tickets-293497698517) and almost certainly leaving early to rest up for my session the next morning :)
