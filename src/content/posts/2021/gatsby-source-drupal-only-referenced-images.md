---
title: Configuring gatsby-source-drupal to only Import Referenced Images
description: Configuring the gatsby-source-drupal plugin to only import a subset of your content is possible, but wasn't immediately clear to me from the docs.
author: Brian
date: 2021-02-19
tags:
  - drupal
---

We've recently started using [Gatsby](https://www.gatsbyjs.com/) on [Bounteous.com](https://www.bounteous.com/), my company's existing Drupal 8 site. Rather than attempting to rebuild the entire front-end at once, we're starting iteratively with small portions of the site and leaving other sections rendered by Drupal (possibly forever.) This approach posed a few interesting problems, one of which was configuring the [gatsby-source-drupal](https://www.gatsbyjs.com/plugins/gatsby-source-drupal/) plugin to only import the content we needed for our build.

The gatsby-source-drupal plugin pulls data from Drupal’s JSON:API endpoints and makes this data available to React components via Gatsby’s GraphQL API. By default, the plugin imports all data from the source Drupal site. Since for this initial phase Gatsby would only be used to build a small subset of pages, most of this data was unnecessary and also would have the side effect of greatly increasing our build times.

As an initial attempt to solve this problem, we used Drupal’s [JSON:API Extras module](https://www.drupal.org/project/jsonapi_extras) to only expose the resources that our Gatsby build needed to depend on. This helped, but we still eventually needed to enable the file resource, which pretty much immediately sunk our build times. Gatsby was now importing (and worse yet processing) local versions of years worth of images that we didn’t need to support our new content. We eventually found that it was possible to configure gatsby-source-drupal to only import the files referenced by content that was necessary for our builds, but it required a combination of configuration options that wasn’t completely obvious from the documentation.

The first step was to add the file resource as a [disallowed link type](https://www.gatsbyjs.com/plugins/gatsby-source-drupal/#disallowed-link-types):

```javascript
// In your gatsby-config.js
module.exports = {
  plugins: [
    {
      resolve: `gatsby-source-drupal`,
      options: {
        baseUrl: <your_url>,
        /// Disallow the full files endpoint
        disallowedLinkTypes: [`self`, `describedby`, `file--file`],
      },
    },
  ],
}
```

This alone would result in all files being ignored by the plugin. A little bit further on in the disallowed link types documentation is the following note:

> When using includes in your JSON:API calls the included data will automatically become available to query, even if the link types are skipped using disallowedLinkTypes. This enables you to fetch only the data you need at build time, instead of all data of a certain entity type or bundle.

This essentially allows us to re-allow specific files if they are referenced by other content. What makes this feature potentially easy to miss is the fact that it uses the plugin’s filter option, which typically further restricts the data sourced from the plugin. The resulting configuration ended up looking like this:

```javascript
// In your gatsby-config.js
module.exports = {
  plugins: [
    {
      resolve: `gatsby-source-drupal`,
      options: {
        baseUrl: <your_url>,
        /// Disallow the full files endpoint
        disallowedLinkTypes: [`self`, `describedby`, `file--file`],
        filters: {
          // Use includes so only the files associated with our decoupled content
          // types are included.
          "node--decoupled_home_page": "include=field_dhp_components",
          "paragraph--dhp_hero": "include=field_dhp_fg_img",
          "paragraph--dhp_animation_cards": "include=field_dhpac_images",
          "paragraph--featured_post": "include=field_dfp_bg_img",
        },
      },
    },
  ],
}
```

With this configuration, if a featured post paragraph is used on the homepage, any associated background images (field_dfp_bg_img) will be sourced by Gatsby as well. While it does require some maintenance as we incorporate new entities into our builds, it has kept our build times quite reasonable thus far.
