---
title: The Perils of Inline and Third-Party Scripts in Next.js
description: In cases where using a third party script tag in Next.js is unavoidable, be aware of these potential stumbling blocks.
author: Brian
date: 2025-01-10
---

In Next.js if you find yourself needing to integrate a script outside of the Node ecosystem (basically something you can't `import`,) you've probably already lost. It can sometimes be unavoidable though. I recently faced this with some third-party ad code that needed to be included in a project and it was tricky to get right. Here are some of the issues I encountered.

## So You've Got a Script...

Your first instinct may be to just toss a traditional `<script>` tag in the Document component.

```jsx
import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html>
      <Head>
        <script
          async
          src="https://securepubads.g.doubleclick.net/tag/js/gpt.js"
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
```

This works, but that affords you very little control over how Next.js loads the script and when it runs in comparison to other scripts. This will be especially problematic if you have other scripts that depend on this one. That was true in my case as I had custom code that needed to run after the third-party ad code had loaded. So I set out to find other alternatives.

## Wrestle Back Some Control with The `<Script>` Component

Capitalizing the first letter in `script` can make a big difference. Aren't computers fun?

Next.js has a [built-in component called `<Script>`](https://nextjs.org/docs/pages/api-reference/components/script) that allows you to control when and how a script is loaded. Here's the previous example adapted to use the `<Script>` component:

```jsx
import { Html, Head, Main, NextScript } from "next/document";
import Script from "next/script";

export default function Document() {
  return (
    <Html>
      <Head>
        <Script
          src="https://securepubads.g.doubleclick.net/tag/js/gpt.js"
          strategy="beforeInteractive"
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
```

The `strategy` prop is especially important here. By default the `<Script>` component will use the 'afterInteractive' strategy, which may be too late for scripts that depend on it. Setting it to 'beforeInteractive' will load the script before any Next.js code and before page hydration.

You can technically use the `<Script>` component in any component on your Next.js site, but in order to use the 'beforeInteractive' strategy, it must be used in the `Document` component.

## If Client Code Depends on These Scripts, You're in for a Wild Ride

Having the control provided by the `loadingStrategy` prop is helpful, but I still found that the order things end up being loaded was a bit unpredictable. Scripts that use the same loading strategy for example wouldn't always load in the order that I referenced them in the source. In my case, this was a problem because I had variable ad slots that depended on this code. So I needed to know for sure within a specific component that the ad code had loaded so I could register slots. This led to some funky things with hooks and quite a bit of trial and error.

Also needed to find a way to update targeting during client side routing (the code was written assuming a full page refresh.) Listening for router events made this pretty straightforward.

## I always could be wrong.

It worked, but still feels pretty hacky. If you have a better strategy, I'd love to hear it.
