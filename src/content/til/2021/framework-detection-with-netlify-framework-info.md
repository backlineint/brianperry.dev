---
title: Framework Detection with @netlify/framework-info
description: I recently needed a way to detect which framework was being used to
  build a site. Not only does Netlify have a solid handle on how to do that, but
  they also open sourced their utility.
author: Brian
date: 2021-07-12T07:33:52.723Z
---
I recently needed a way to detect which framework was being used to build a site. Immediately I wondered, "how does Netlify do this?" When setting up a new site, Netlify is able to determine things like your build command and publish directory. I didn't have to search too long for an answer because it turns out Netlify has open sourced [the utility they use for framework detection](https://github.com/netlify/framework-info).

Here's a simple example that outputs information about the detected framework, and also tests for the existence of a specific framework.

```js
const { listFrameworks, hasFramework } = require("@netlify/framework-info");

async function detectFramework() {
  // listFrameworks() returns proimise containing tons of framework data
  const frameworkData = await listFrameworks();
  console.log("Framework Object: ", frameworkData);
  console.log("Detected Dev Commands: ", frameworkData[0].dev);
  console.log("Detected Build Commands: ", frameworkData[0].build);

  // hasFramework() can test for a specific framework
  const isVue = await hasFramework("vue");
  const isNext = await hasFramework("next");
  console.log("Is this Vue? ", isVue);
  console.log("Is this Next? ", isNext);
}

detectFramework();
```

The output of above when used in a NextJS project would look like this:

```bash
sandbox@sse-sandbox-0ngye:/sandbox$ node detect.js
Framework Object:  [
  {
    id: 'next',
    name: 'Next.js',
    category: 'static_site_generator',
    dev: { commands: [Array], port: 3000, pollingStrategies: [Array] },
    build: { commands: [Array], directory: 'out' },
    staticAssetsDirectory: undefined,
    env: {},
    plugins: [ '@netlify/plugin-nextjs' ]
  }
]
Detected Dev Commands:  {
  commands: [ 'yarn dev', 'yarn start', 'yarn build' ],
  port: 3000,
  pollingStrategies: [ { name: 'TCP' } ]
}
Detected Build Commands:  { commands: [ 'next build' ], directory: 'out' }
Is this Vue?  false
Is this Next?  true
```

Or alternatively, you can [try it out in this CodeSandbox](https://codesandbox.io/s/framework-detection-0ngye?file=/detect.js).

Detecting a framework is hardly an everyday activity for most (at least I hope it isn't,) but if you ever need to do it, this package is super handy. You can also run it via the CLI using the related [build-info project](https://github.com/netlify/build-info).