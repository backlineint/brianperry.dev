---
title: Adding Excerpts to an 11ty RSS Feed
description: There are a couple of ways to add excerpts to 11ty feeds, here is a look at the approach I ended up using for this site.
author: Brian
date: 2021-03-02
---

I previously wrote about [creating multiple feeds with the 11ty RSS Plugin](/til/2021/creating-multiple-feeds-with-the-11ty-rss-plugin/) which I was doing in service of creating a feed for [Planet Drupal](https://www.drupal.org/planet). While creating a second feed was an important first step, I also [found that my feed needed to have an excerpt](https://www.drupal.org/project/content/issues/3199462) of a specific maximum length.

There are a handful of options out there for handling excerpts with 11ty. [eleventy-plugin-excerpt](https://www.npmjs.com/package/eleventy-plugin-excerpt) adds a universal shortcode for excerpts. This was close to what I needed, but the shortcode takes the entire template object as an input, which made using additional filters like htmlToAbsoluteUrls from [eleventy-rss](https://www.11ty.dev/docs/plugins/rss/) difficult.

Slightly buried in the docs to customize front matter parsing is an example of [parsing excerpts from content](https://www.11ty.dev/docs/data-frontmatter-customize/#example-parse-excerpts-from-content) using additional options from the gray-matter package. I was only able to access the excerpt in my feed if I used an excerpt alias for some reason, so I ended up adding the following to my 11ty config:

```js
eleventyConfig.setFrontMatterParsingOptions({
  excerpt: true,
  excerpt_alias: 'feed_excerpt'
});
```

I can now include a separator in my post markdown as follows:

***This will serve as my excerpt. It is also included in the full post.<br />
\-\-\-<br />
And everything after will also be included in the full post, but not the excerpt.***

It is also possible to manually overwrite the excerpt field by specifying it in your markdown front matter. This nice little escape hatch comes in handy if you want the excerpt to combine non sequential parts of the post, or otherwise work around some markup that should be excluded from the excerpt.

Since these excerpts were being added for an RSS feed, I also needed to take an extra step to ensure that the excerpt was being rendered as markup rather than raw markdown. As a quick workaround, I created a custom `feedEncode` filter using 11ty's default markdown parsing library:

```js
// eleventy.js
const md = require('markdown-it')();

// add within module.exports function:
eleventyConfig.addNunjucksFilter("feedEncode", function(value) {
  return value ? md.render(value) : '';
});
```

Then in my feed template, I can pass the excerpt through my filter to ensure it will be rendered as html in feed readers:

***<description>\{\{ post.data.feed_excerpt | htmlToAbsoluteUrls(absolutePostUrl) | feedEncode \}\}</description>***

Due to some confusion related to feed validation, I also created [an RSS feed example for the 11ty RSS plugin](https://github.com/11ty/eleventy-plugin-rss/pull/24). In hindsight, I could have gotten away with the default Atom feed example, but perhaps someone else out there will find this useful.