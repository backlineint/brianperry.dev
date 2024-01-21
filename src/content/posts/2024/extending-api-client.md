---
title: Extending the Drupal API Client
description: We're building the Drupal API Client to be easily extended. This post demonstrates that extensibility by creating a client for the Decoupled Router module.
author: Brian
date: 2024-01-22
---

As a result of our Pitch-burgh funding, the current primary goal of the Drupal API Client project is to create a fully featured client for Drupal's JSON:API implementation. Even with that goal, we've focused on making our work extensible for other API formats in the future. A large part of this has been creating an `ApiClient` base class. Functionality that could apply to any API client is added to the base class, while anything specific to JSON:API is added to the `JsonApiClient` class (which extends `ApiClient`.)

Recently, we have been working on adding support for the Decoupled Router endpoint. This implementation has proven to be a great example of the extensibility of the library, so I thought elaborating on it in a blog post could be useful for those who want to extend the API Client in the future.

## The Decoupled Router Endpoint
