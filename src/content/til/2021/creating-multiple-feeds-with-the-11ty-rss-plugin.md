---
title: Creating Multiple Feeds with the 11ty RSS Plugin
description: A few small configuration adjustments that can be used to create
  multiple filtered feeds using the 11ty RSS plugin.
author: Brian
date: 2021-02-13T16:54:34.840Z
---
Creating a feed using the [11ty RSS plugin](https://www.11ty.dev/docs/plugins/rss/) is pretty straightforward and doesn't require much configuration. Less obvious to me was how to create a second feed for a filtered subset of my data. In this case I wanted to create a feed of only posts tagged with 'Drupal' that can be submitted to [Planet Drupal](https://www.drupal.org/planet).

Since the plugin required so little configuration, it wasn't clear to me if there was a way to make the plugin aware of a second feed template. As it turns out, the plugin is smart enough to pick up on any number of feed templates, located anywhere in your codebase. I created a `/src/_feeds` directory that contained by default `feeds.njk` template and my new Drupal-specific `drupal.njk` template. As long as you add a unique permalink in this template's json frontmatter, the plugin will generate a new feed for you. In this case I used:

```json
  "permalink": "drupal.xml",
```

Next was determining how to filter my 11ty collection based on a specific tag. This [quick tip on creating tag pages](https://www.11ty.dev/docs/quicktips/tag-pages/) gave me what I needed. Instead of iterating through `collections.all` as I did in my default feed, I added the following tag filter:

```html
{`%- for post in collections[ 'drupal' ] | reverse %`}
```

As a result, I had only my content tagged with Drupal. The resulting `drupal.njk` feed template looked like this:

<script src="https://emgithub.com/embed-v2.js?target=https%3A%2F%2Fgithub.com%2Fbacklineint%2Fbpi-11ty%2Fblob%2Fmaster%2Fsrc%2F_feeds%2Fdrupal.njk&style=default&type=code&showBorder=on&showLineNumbers=on&showFileMeta=on&showFullPath=on&showCopy=on"></script>

Now all I have to do is write some Drupal related posts...