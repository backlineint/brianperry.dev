---
title: Embedding a File From Github as a Gist
description: In cases where prism.js syntax highlighting isn't practical on my
  site, these tools to create a gist-like embed from any github file have come
  in handy.
author: Brian
date: 2021-03-09T23:19:12.888Z
---
This is probably the first personal site I've ever had that has quality [syntax highlighting for code snippets](https://www.11ty.dev/docs/plugins/syntaxhighlight/). But there are still cases where it would be easier to include an example from a github repository wholesale. I've found a couple of services that handle this nicely.

* [Gist It](https://gist-it.appspot.com/)
* [Embed Like Gist](https://emgithub.com/)

I've been using Gist It, because the styles on this site conflict with Embed Like Gist.

For either of these services, it is as easy as embedding a script tag within the markdown file for my post.

```md
## Markdown Heading
<script src="https://gist-it.appspot.com/github/robertkrimen/gist-it-example/blob/master/example.js"></script>
### More markdown
```

The output looks like this:

<script src="https://gist-it.appspot.com/github/robertkrimen/gist-it-example/blob/master/example.js"></script>

Handy trick, but but a tradeoff - highlighting the code in the post itself will work forever, but this approach will only work as long as the services exist.