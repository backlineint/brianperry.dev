---
title: The Perils of Inline and Third-Party Scripts in Next.js
description: In cases where using a third party script tag in Next.js is unavoidable, be aware of these potential stumbling blocks.
author: Brian
date: 2025-01-10
---

If you find yourself needing to integrate a script outside of the Node ecosystem (basically something you can't `import`,) you've probably already lost. It can sometimes be unavoidable though. I recently faced this with some third-party ad code that needed to be included in a Next.js project and it was tricky to get right. Here are some of the issues I encountered and how I resolved them.

## So You've Got a `<script>` Tag...

You can just toss a script tag in there. But that affords you very little control over how Next.js loads it and when it runs.

## Wrestle Back Some Control with The `<Script>` Component

Next.js has a built-in component called `<Script>` that allows you to control when and how a script is loaded. This gives you a bit more control over the script's behavior.

```jsx
const some = "code";
```

BeforeInteractive can force it to load early, but has to be in the document component.

I still find that the order things end up being loaded is a bit unpredictable.

## If Client Code Depends on These Scripts, You're in for a Wild Ride

I had variable ad slots that depended on this code. So I needed to know for sure within a specific component that the ad code had loaded so I could register slots. This led to some funky things with hooks and quite a bit of trial and error.

Also needed to find a way to update targeting during client side routing (the code was written assuming a full page refresh.) Listening for router events made this pretty straightforward.

## I always could be wrong.

It worked, but still feels pretty hacky. If you have a better strategy, I'd love to hear it.
