---
title: What I'm Excited About in Lit 2.0
description: I've really enjoyed the developer experience improvements that
  Lit-element and Lit-html have offered for building web components, and I'm
  even more excited for these new features in Lit 2.0
author: Brian
date: 2021-04-21T17:12:58.792Z
---

I tuned in for the live Lit launch event on YouTube today, which was surprisingly ~~long~~ detailed. I've really enjoyed the developer experience improvements that Lit-element and Lit-html have offered for building web components, and I'm even more excited for these new features in Lit 2.0.

<iframe src="https://www.youtube.com/embed/f1j7b696L-E" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>

### The new Lit branding

I've always found the Polymer branding and the division between the Lit-element and Lit-html websites confusing. Having both packages live on just as Lit is so much more pleasant. Not to mention the fact that Lit is a super cool name.

### Server Side Rendering support

Currently [pre-release under Lit labs](https://github.com/lit/lit/tree/main/packages/labs/ssr), SSR support is one of the biggest ticket features in Lit 2.0. Much more learning to come here, but this should open up a wide variety of use cases. And it also uses a [proposed declarative Shadow DOM feature](https://www.chromestatus.com/feature/5191745052606464), the impact of which is kind of mindblowing:

> This API allows Web Components that use Shadow DOM to also make use of Server-Side Rendering (SSR), to get rendered content onscreen quickly without requiring Javascript for shadow root attachment.

### IE 11 support is opt-in

When we can all ditch IE, we can ditch the extra dependency weight as well.

### Refs

There are other ways to query and reference an element, but since I'm familiar with the pattern from React, having [refs](https://lit.dev/docs/api/directives/#createRef) as an option is nice.

### React

Speaking of React, another exciting Lit Labs project is [improved React integration](https://github.com/lit/lit/tree/main/packages/labs/react). React has some [long-standing limitations](https://custom-elements-everywhere.com/#react) related to making use of web components. I'd prefer to see React address this (and hope that as web component adoption grows their hand will be forced,) but Lit taking matters into their own hands is the next best thing.

### Playground elements

Not necessarily a Lit 2.0 specific feature, but [playground elements](https://github.com/PolymerLabs/playground-elements/#readme) are used heavily throughout the great new [Lit documentation](https://lit.dev/playground/) and I have a long dormant side project that has been begging for this element.

### Reactive controllers... probably

I still need to wrap my head around the impact of [reactive controllers](https://lit.dev/docs/composition/controllers/). My hope is that it will simplify the application level state management story, but need to learn more to make sure I'm not jumping to conclusions here.

### Simple

It feels like there is a lot here, and I hope Lit manages to maintain the simplicity that drew me to it in the first place. Hopefully the new tagline of 'Simple. Fast. Web Components.' remains true. Regardless, I'm excited to make this upgrade in [the web component library I've been working on](https://www.drupal.org/project/gdwc) and start experimenting.
