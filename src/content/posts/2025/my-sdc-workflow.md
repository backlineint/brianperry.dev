---
title: My Single Directory Components Workflow
description: A walkthrough of the workflow I used to build a custom Drupal theme that relies heavily on Single Directory Components
author: Brian
date: 2025-01-18
tags:
  - drupal
---

Recently I've been working on my first honest to God Drupal theme in years after primarily building decoupled front ends. This also proved to be the first time I could really put [Single Directory Components](https://www.drupal.org/docs/develop/theming-drupal/using-single-directory-components) (SDCs) to the test, after following along with development and experimenting in small side projects. I found pretty quickly that SDCs offered a bridge to the component based workflow I was familiar with that felt pretty comfortable. Further more, as my workflow established itself, an interesting pattern emerged around progressive enhancement and custom elements.

### Identify Your Components

This is kind of self explanatory, but is still an important part of the process. And it isn't necessarily Drupal specific. Look at your design, and identify the components that you'll need to build. I used astro for prototyping.

### Initial Component Scaffolding

When I identified a component that I needed to build, I'd start by creating the simplest possible representation of it as a single directory component. First I'd create a `component.yml` file in the `components` directory of my theme. The simplest possible version would be.

```yml
# components/header/header.component.yml
name: Header
props:
  type: object
  properties: {}
```

That's a component with no props or slots, so basically not a component at all. But it exists, which is still a small victory.

We can take the step of adding some obvious slots since we're here:

```yml
# components/header/header.component.yml
name: Header
props:
  type: object
  properties: {}
slots:
  logo:
    title: Logo
    description: Site logo
  content:
    title: Content
    description: Header content
```

Those slots are quite broad, but in my work with SDCs thus far I've found that using Drupal's markup where you can is usually a good idea. So often start with broad slots and narrow them down as needed. We'll also see in a bit how drastically altering markup for things like images or menus often isn't necessary.

At this point, I'd add a bare bones twig template to start getting something on the screen. But this is also where I found myself bringing a little more flavor from my framework component workflow to Drupal.

### I Want My Cool Custom Tag

If I was using a framework like React, I'd create my header component and be off to the races. Something like:

```jsx
// Header.js
import React from "react";

export const Header = ({ logo, content }) => (
  <header>
    <div>{logo}</div>
    <div>{content}</div>
  </header>
);
```

And then I'd have a `<Header>` component that I could import and use anywhere in my app.

Single Directory Components end up getting close to that.

```twig
{# components/header/header.html.twig #}
<header>
  {% block logo %}{%endblock%}
  {% block content %}{%endblock%}
</header>
```

And then I'd use it in a template like:

```twig
{# templates/page.html.twig #}
{% embed 'mytheme:header' %}
  {% block logo %}{# my logo markup #}{% endblock %}
  {% block content %}
    {# my content markup - {{page.header}} for example #}
  {% endblock %}
{% endembed %}
```

That's nice, but I found that combining this with custom elements was a great way to get a little closer to the React experience, and also had some nice side effects.

### TAC CSS Methodology

...

### HTML Web Components

...

### One WYSIWG-Related Catch

Using custom elements in CKEditor is tricky. Or maybe I just don't know how to do it.
