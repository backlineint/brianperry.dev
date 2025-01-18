---
title: The Perils of Third-Party Scripts in Next.js
description: In cases where using a third party script tag in Next.js is unavoidable, be aware of these potential stumbling blocks.
author: Brian
date: 2025-01-15
---

In [Next.js](https://nextjs.org/) if you find yourself needing to integrate a script outside of the Node ecosystem (basically something you can't `import`,) you've probably already lost. It can sometimes be unavoidable though. I recently faced this with some third-party ad code that needed to be included in a project and it was tricky to get right.

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

[The `strategy` prop](https://nextjs.org/docs/pages/api-reference/components/script#strategy) is especially important here. By default the `<Script>` component will use the `afterInteractive` strategy, which may be too late for scripts that depend on it. Setting it to `beforeInteractive` will load the script before any Next.js code and before page hydration.

You can technically use the `<Script>` component in any component on your Next.js site, but in order to use the `beforeInteractive` strategy, it must be used in the `Document` component.

## If Client Code Depends on These Scripts, My Thoughts Are With You

Having the control provided by the `loadingStrategy` prop is helpful, but I still found that the loading order was a bit unpredictable. Scripts that use the same loading strategy wouldn't always load in the order that I referenced them in the source. In my case, this was a problem because I had variable ad slots that depended on this code. I essentially needed to:

- Load the third-party ad script
- Once that loads, run custom ad code that defines ad slots and sets targeting. This code was provided by a another vendor, and was not written with Next.js in mind.
- After the ad slots have been defined, display them based on the current page's content.

The Next `<Script>` component offers [`onLoad`](https://nextjs.org/docs/pages/api-reference/components/script#onload) and [`onReady`](https://nextjs.org/docs/pages/api-reference/components/script#onready) props that can help with this. I initially assumed that `onLoad` would be the right choice, but it has some important limitations. It can't be used with `beforeInteractive` and also does not yet work with Server Components. That makes `onReady` the only viable option here. Since `onReady` only runs on the client, we'd also need to move the script outside of the `Document` component as well.

```jsx
import Script from "next/script";

export default function Ad() {
  return (
    <>
      <Script
        id="ad-targeting"
        src="https://securepubads.g.doubleclick.net/tag/js/gpt.js"
        onReady={() => {
          console.log("Run custom ad targeting code here");
        }}
      />
      <div id="ad-slot"></div>
    </>
  );
}
```

I actually ended up taking a different approach inside of a `useEffect` hook that carefully checks for the existence of the window object, specific `googletag` methods, and runs only once. If given an opportunity to refactor this, I'd adapt it to use the `onReady` prop instead.

I also also needed to find a way to update targeting during client side routing since the ad targeting code was written assuming a full page refresh. Listening for router events made this pretty straightforward.

```jsx
// re-set ad targeting on route change
useEffect(() => {
  router.events.on("routeChangeComplete", handleRouteChange);

  // If the component is unmounted, unsubscribe
  // from the event with the `off` method:
  return () => {
    router.events.off("routeChangeComplete", handleRouteChange);
  };
}, [router]);
```

`handleRouteChange` is a function that re-runs the ad targeting code, considering the new route.

## Always Open to a Cleaner Solution

What I have in place works, but still feels hackier than I'd prefer. If you've found a better solution for something similar, I'd love to hear it.
