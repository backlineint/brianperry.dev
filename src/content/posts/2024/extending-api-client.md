---
title: Extending The Drupal API Client
description: We're building the Drupal API Client to be easily extended. This post demonstrates that extensibility by creating a client for the Decoupled Router module.
author: Brian
date: 2024-01-22
---

As a result of our [Pitch-burgh funding](https://www.drupal.org/innovation/pitchburgh-2023), the current primary goal of [the Drupal API Client](https://www.drupal.org/project/api_client) is to create a fully featured client for Drupal's JSON:API implementation. Even with that goal, we've focused on making our work extensible for other API formats in the future through the implementation of an `ApiClient` base class. Functionality that could apply to any API client is added to the base class, while anything specific to JSON:API is added to the `JsonApiClient` class (which extends `ApiClient`.)

Recently, we have been working on adding [Decoupled Router](https://www.drupal.org/project/decoupled_router) support to [our JSON:API Client](https://www.npmjs.com/package/@drupal-api-client/json-api-client). I found this implementation to be a great example of the extensibility of the library, so I wanted elaborate on it in a blog post for those who may want to extend the API Client in the future.

Our end goal was that as an alternative to our existing JsonApiClient.getResource method:

```
const myArticle = client.getResource('node--article', '3347c400-302d-4f6c-8fcb-3e74beb002c8');
```

Users of Decoupled Router could also get an identical response by resolving a path:

```
const theSameArticle = client.getResource('/articles/give-it-a-go-and-grow-your-own-herbs');
```

To achieve this, we first needed to provide a way to reliably get data from Decoupled Router.

## The Decoupled Router Endpoint

With the module enabled, Decoupled Router exposes an endpoint with the following structure:

`/router/translate-path?path=<path>`

Given a path like `/articles/give-it-a-go-and-grow-your-own-herbs` the endpoint could provide a response similar to:

```json
{
  "resolved": "https://dev-drupal-api-client-poc.pantheonsite.io/en/articles/give-it-a-go-and-grow-your-own-herbs",
  "isHomePath": false,
  "entity": {
    "canonical": "https://dev-drupal-api-client-poc.pantheonsite.io/en/articles/give-it-a-go-and-grow-your-own-herbs",
    "type": "node",
    "bundle": "article",
    "id": "11",
    "uuid": "3347c400-302d-4f6c-8fcb-3e74beb002c8"
  },
  "label": "Give it a go and grow your own herbs",
  "jsonapi": {
    "individual": "https://dev-drupal-api-client-poc.pantheonsite.io/en/jsonapi/node/article/3347c400-302d-4f6c-8fcb-3e74beb002c8",
    "resourceName": "node--article",
    "pathPrefix": "jsonapi",
    "basePath": "/jsonapi",
    "entryPoint": "https://dev-drupal-api-client-poc.pantheonsite.io/en/jsonapi"
  },
  "meta": {
    "deprecated": {
      "jsonapi.pathPrefix": "This property has been deprecated and will be removed in the next version of Decoupled Router. Use basePath instead."
    }
  }
}
```

It is worth noting that while easy to make sense of, this response technically doesn't follow the JSON:API spec, so we can't use our existing JSON:API Client without modification. We could write a small amount of custom code to fetch and handle data from this endpoint, but just as we're doing for the JSON:API Client itself, this case is exactly what our ApiClient base class is intended for. With a similarly small amount of code we can extend the ApiClient class to add only what is unique to the Decoupled Router endpoint, while getting access to all of the features of the base class at the same time.

A simple Decoupled Router client that extends ApiClient could look like this:

TODO: Figure out how to annotate the file name for prisma.

```ts
// DecoupledRouterClient.ts

import {
  ApiClient,
  ApiClientOptions,
  BaseUrl,
} from "@drupal-api-client/api-client";

export class DecoupledRouterClient extends ApiClient {
  constructor(baseUrl: BaseUrl, options?: ApiClientOptions) {
    super(baseUrl, options);
    const { apiPrefix } = options || {};
    this.apiPrefix = apiPrefix || "router/translate-path";
  }

  async translatePath(path: string) {
    const apiUrl = `${this.baseUrl}/${this.apiPrefix}?path=${path}`;
    const response = await this.fetch(apiUrl);

    return response.json();
  }
}
```

After extending the class we call the constructor, followed by super() to ensure that all of the properties of the base class are set. At this point, the only modification we want to make is the default value for the API prefix - Decoupled Router uses `router/translate-path`. This way if an instance of the Decoupled Router class is created without this option, it will work with the usual decoupled router endpoint.

We then define a translatePath method that takes a path of type string, uses the provided fetch method to make a request to Decoupled Router, and returns a promise with the provided json data.

Using an instance of this class would look something like:

```ts
// main.ts

import { DecoupledRouterClient } from "./DecoupledRouterClient.ts";

const baseUrl = "https://dev-drupal-api-client-poc.pantheonsite.io";
const decoupledRouterClient = new DecoupledRouterClient(baseUrl);

const translatedPath = await decoupledRouterClient.translatePath(
  "/articles/give-it-a-go-and-grow-your-own-herbs"
);
```

We're up and running, but the real power comes when we look beyond this hello world example. Want your API requests to be authenticated? Since we extended the ApiClient class we have access to all provided authentication options:

```ts
// Revised main.ts with authentication example
```

Maybe another example? Locale?

Add any other specific work necessary for this implementation.

Routing is a common problem, so we're adding this to our JSON:API Client so you don't have to. But working through this really helped validate the extensible nature of this library. Our routing methods just use an instance of this new class...

While we can use our the clients caching functionality, getResourceByPath still makes multiple API calls for uncached data, which is not ideal. We could optimize this by supporting subrequests in the future. That is yet another type of Drupal API that could use this base class...
