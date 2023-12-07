---
title: Using Apollo Client Without React
description: By default, Apollo Client 3.0 expects that you are using React, but
  importing Apollo using a slightly different entry point allows you to use
  Apollo in a vanilla JS project.
author: Brian
date: 2021-08-04T02:24:32.942Z
---
I've been experimenting with [Apollo Client](https://www.apollographql.com/docs/react/) recently and started work on a new package that will use it as a dependency. After some initial experiments in a Create React App project, I scaffolded a new vanilla JS project using [Vite](https://vitejs.dev/). Much to my surprise, when I added Apollo my build started failing because React was missing as a dependency. It took me a little longer than I expected to figure out why this was happening.

As of Apollo 3.0 the import example in the getting started docs will also bring some React hooks along for the ride:

```js
import { ApolloClient, gql, InMemoryCache } from "@apollo/client";
```

To use Apollo in a vanilla JS project, you instead need to use the entry point `@apollo/client/core`:

```js
import { ApolloClient, gql, InMemoryCache } from "@apollo/client/core";
```

This is documented, but was a little hard to find [within the Apollo 3.0 migration guide](https://www.apollographql.com/docs/react/migrating/apollo-client-3-migration/#using-apollo-client-without-react). Hopefully giving this a little more Google juice might save someone a few minutes in the future.

