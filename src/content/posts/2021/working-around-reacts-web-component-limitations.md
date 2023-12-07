---
title: Working Around React's Web Component Limitations
description: React still has some limitations when it comes to using web
  components, but @lit-labs/react makes it much easier to work through them.
author: Brian
date: 2021-08-1T01:55:21.398Z
---

One of the most exciting features of web components is the fact that they can be used in any JavaScript framework. If you scan through the list at [Custom Elements Everywhere](https://custom-elements-everywhere.com/) you'll see that coverage is really solid across the board... until you get to React.

As [the test results](https://custom-elements-everywhere.com/libraries/react/results/results.html) show, the limitations fall into two main categories. The first is that React can't automatically pass non-string data like arrays and objects into custom element properties.

Take for example this election results tracker component: `<results-tracker>`. All of the properties of the component are strings, except for candidates, which expects an array of objects like:

```json
const candidates = [
  {
    name: "Joseph R. Biden Jr.",
    primary: 253,
    secondary: 73879622,
    color: "#1375b7"
  },
  {
    name: "Donald J. Trump",
    primary: 214,
    secondary: 69772905,
    color: "#c93135"
  }
];
```

You would assume that you could pass in the `candidates` array just as you could in a React component.

```html
<results-tracker
  headline="{headline}"
  race="{race}"
  total="{total}"
  candidates="{candidates}"
>
  <p>{subheadline}</p>
</results-tracker>
```

Instead, you'll be met with an error. You can work around it by converting the `candidates` array to a JSON string, but it feels a little dirty.

```html
<results-tracker
  headline="{headline}"
  race="{race}"
  total="{total}"
  candidates="{JSON.stringify(candidates)}"
>
  <p>{subheadline}</p>
</results-tracker>
```

The second and larger category of limitations are related to events. React does not automatically listen to events dispatched by a custom element.

Take for example the [generic-switch component](https://genericcomponents.netlify.app/generic-switch/demo/index.html) from [@generic-components/components](https://github.com/thepassle/generic-components). `<generic-switch>` emits a `checked-changed` event when toggling the switch on or off. You may want to update some application state as a result of this event, but by default React won't be aware of it.

To handle this event, you could create a wrapping component that uses a ref to listen to the `checked-changed` event. Within the app, you'd use your wrapper component instead of the custom element itself:

```html
<SwitchProvider checked handleToggle="{togglePolitics}">
  Politics:
</SwitchProvider>
```

The specifics don't really matter for this example, but the `togglePolitics()` function updates the necessary application state when the switch is toggled.

The wrapping component itself would look something like this:

```js
import { useEffect, useRef } from "react";

import "@thepassle/generic-components/generic-switch.js";

const SwitchProvider = ({ checked, handleToggle, children }) => {
  const switchRef = useRef();

  useEffect(() => {
    switchRef.current.addEventListener("checked-changed", (e) => {
      handleToggle(switchRef.current.__checked);
    });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  // Can't add handleToggle as a dependency above because it would result in
  // this hook being called multiple times

  return (
    <generic-switch checked={checked} ref={switchRef}>
      {children}
    </generic-switch>
  );
};

export default SwitchProvider;
```

That gets the job done, but it is quite a bit of additional boilerplate. Almost enough to make you consider just using a React based switch component instead.

With [the release of Lit 2.0](https://lit.dev/blog/2021-04-21-lit-2.0-meet-lit-all-over-again/) the Lit team has created a number of supporting Lit Labs packages, including [@lit-labs/react](https://www.npmjs.com/package/@lit-labs/react). @lit-labs/react provides improved React integration for Web Components, and with the `createComponent` utility it just so happens to address both of the issues outlined earlier in this post.

Going back to our `<results-tracker>` component, you'll recall that in order to pass an array of objects into the candidates property we had to first convert the variable into a string using `JSON.stringify()`. Using @lit-labs/react we could create a wrapping component for `<results-tracker>`:

```js
import React from "react";
import { ResultsTracker } from "@backlineint/results-tracker";
import { createComponent } from "@lit-labs/react";

export const ResultsTrackerWrapper = createComponent(
  React,
  "results-tracker",
  ResultsTracker
);
```

If we then use this wrapping component in our render method, we can pass in an array with no additional conversion necessary.

```html
<ResultsTrackerWrapper
  headline="{headline}"
  race="{race}"
  total="{total}"
  candidates="{candidates}"
>
  <p>{subheadline}</p>
</ResultsTrackerWrapper>
```

This works because `createComponent` actually discovers the available properties of the related web component, and then sets any props passed into the component as properties (which can be non-string values) of the web component rather than attributes (which must be strings). Using a wrapping component for this simple example feels a little heavy, but for more complicated components this could save quite a bit of effort.

Looking back at events emitted by `<generic-switch>`, `createComponent` can save us even more boilerplate. When using `createComponent` to create a wrapping component we can also provide a mapping of React prop names to events fired by the custom element.

```js
import React from "react";
import { createComponent } from "@lit-labs/react";
import GenericSwitch from "@thepassle/generic-components/generic-switch.js";

export const GenericSwitchComponent = createComponent(
  React,
  "generic-switch",
  GenericSwitch,
  {
    onCheckedChanged: "checked-changed",
  }
);
```

So now when `<generic-switch>` emits a `checked-changed` event, the `onCheckedChanged` event prop we specified will fire. If we pass our `togglePolitics` function that updates the application state, we've wired up everything we need to make React respond to the event within our web component.

```html
<GenericSwitchComponent
  checked="{checked"
  ?
  true
  :
  undefined}
  onCheckedChanged="{togglePolitics}"
/>
```

We're still using a wrapping React component here, but this approach feels much leaner.

@lit-labs/react also has an additional `useControler` hook as well which provides support for the [reactive controller concept](https://lit.dev/docs/composition/controllers/) introduced in Lit 2. I don't have experience with reactive controllers as of yet, so I haven't made use of that hook. But it is nice to know it is there if I do take advantage of that feature in the future.

In a perfect world, I'd love to see React resolve these issues with Web Components within the framework themselves. My hope is that growing web component adoption will force their hand. But in the meantime, the Lit team taking matters into their own hands seems like the next best thing.

If you'd like to see the full example in action, I've created a couple of code sandboxes.

The first uses React only:

<iframe src="https://codesandbox.io/embed/web-components-with-react-tvnwd?fontsize=14&hidenavigation=1&theme=dark&view=editor"
     style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;"
     title="Web Components With React"
     allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
     sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
   ></iframe>

And the second refactors to use @lit-labs/react:

<iframe src="https://codesandbox.io/embed/lit-react-358ez?fontsize=14&hidenavigation=1&theme=dark&view=editor"
     style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;"
     title="Lit React"
     allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
     sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
   ></iframe>
