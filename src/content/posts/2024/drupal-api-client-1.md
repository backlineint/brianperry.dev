---
title: Drupal API Client 1.0 Release
description: The 1.0 release of the Drupal API Client includes a fully functional JSON:API client and completes our commitment as a result of funding from the 'Pitch-burgh' innovation contest.
author: Brian
date: 2024-04-24
tags:
  - drupal
---

We're extremely excited to announce the 1.0 release of the [Drupal API Client](https://www.drupal.org/project/api_client). This release includes a fully functional JSON:API client and completes our commitment as a result of funding from the ['Pitch-burgh' innovation contest](https://www.drupal.org/innovation/pitchburgh-2023).

Before diving into the details of some recent updates, let's recap the state of the project now that it has reached 1.0.

## What is the Drupal API Client?

The Drupal API Client is a set of JavaScript packages that simplify the process of interacting with common Drupal APIs. Most commonly, developers will use our [JSON:API client](https://www.npmjs.com/package/@drupal-api-client/json-api-client) to interface with Drupal's JSON:API endpoints, but we also publish [a base API Client package that can be extended](/posts/2024/extending-api-client), [a client for Decoupled Router](https://www.npmjs.com/package/@drupal-api-client/decoupled-router-client), and [may support other Drupal APIs in the future](https://www.drupal.org/project/api_client/issues/3373029).

The Drupal API Client takes great care to be framework-agnostic and universal. It can be used:

- [with your JavaScript framework of choice](https://project.pages.drupalcode.org/api_client/with-frameworks/overview/), vanilla JavaScript, or even in Drupal itself.
- with or without TypeScript.
- on the server, or on the client.
- with a bundler, or as a script import from a CDN.

## Recent Developments

- We've completed our Pitch-burgh commitment and released JSON:API Client 1.0. Thanks to all who contributed along the way!
- We've published [detailed documentation on GitLab Pages](https://project.pages.drupalcode.org/api_client/). The docs include live code examples, and is itself an example of using the API Client with [Astro](https://astro.build/).
- We've opened an [issue proposing that the Drupal API Client packages be promoted to the Drupal namespace on npm](https://www.drupal.org/project/ideas/issues/3440566). We'd love your feedback and support on the issue.
- We're refining [our 1.x roadmap](https://www.drupal.org/project/api_client/issues/3440572) and soliciting community feedback. One proposed priority will be [TypeScript improvements and automatic type generation](https://www.drupal.org/project/api_client/issues/3421478).

## See you at Stanford WebCamp and DrupalCon!

Moving forward, we hope to prioritize additional features for projects that could use our libraries as a dependency. Catch up with us at community events in May to learn more and share your use cases.

- The Drupal API Client will be featured in [a session at Stanford WebCamp](https://webcamp.stanford.edu/session/the-drupal-api-client). Sessions are free and virtual, so this is a great way to get a more detailed overview of the project.
- We'll be holding a [Birds of a Feather](https://events.drupal.org/files/media/documents/DrupalCon2024_Schedules_BoF.pdf) discussion and participating in contribution events at DrupalCon Portland. The BOF will be on Monday, May 6 in room G129 at 4PM.

Beyond these events, we're always available in the #api-client channel on [Drupal Slack](https://www.drupal.org/community/contributor-guide/reference-information/talk/tools/slack) and monitoring [our issue queue](https://www.drupal.org/project/issues/api_client). Hope to see you there!
