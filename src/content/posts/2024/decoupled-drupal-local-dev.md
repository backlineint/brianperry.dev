---
title: Creating a Local Development Environment for Decoupled Drupal
description: My process for using DDEV to create a local environment to support decoupled Drupal development.
author: Brian
date: 2024-02-26
---

Early on when outlining requirements for the Drupal API Client we identified [the need to make a local Drupal environment available](https://www.drupal.org/project/api_client/issues/3379155) in our monorepo. Since our early work was mostly on read based operations, it was easy to postpone this in favor of sourcing data from a publicly available Drupal instance. However, as we got deeper into things like authentication and operations that modify data, it became increasingly cumbersome developing without a Drupal environment that each developer could easily control.

## Requirements

Our needs are a bit different from those of a traditional local Drupal environment, because we currently aren't concerned with development on the Drupal side of things. We need to use Drupal as a CMS and API, and have the ability to customize configuration, but likely won't be creating custom modules or themes. With that in mind, our requirements were:

- Easily create and destroy a Drupal instance based on Drupal core, enabling additional modules to support Decoupled use cases.
- Require as little Drupal specific tooling to be installed locally as possible. The host machine should not need to have composer pre-installed for example.
- JSON:API should be enabled, and allow modification of resources.
- Drupal's CORS configuration should be adjusted to allow all CRUD operations in both server and client environments.
- The Drupal environment should be disposable and not part of the codebase by default.

Thanks to Matt, used DDEV - Reference Matt suggestion on issue / API Client context

- Step by step
  - Hooks didn’t quite give me what I needed
- Future - a recipe
- Share template repo.

Thanks to Matt, used DDEV - Reference Matt suggestion on issue / API Client context
