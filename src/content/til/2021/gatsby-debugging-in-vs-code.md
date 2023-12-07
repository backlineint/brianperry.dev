---
title: Gatsby Debugging in VS Code
description: A few useful links to configure server and client side debugging in
  Gatsby projects
author: Brian
date: 2021-01-29
---
I've actually never had JS debugging working correctly in my Gatsby projects, which has always bugged me. With the help of a few guides today I learned how to change that.

My initial need was client side debugging, which was covered well in the appropriately named [How to debug Gatsby JS in VS Code](https://medium.com/@arthur.rodzkin/how-to-debug-gatsby-js-build-process-and-html-in-vs-code-6d1a31512b5b) The Node debugging instructions in that post didn't work for me, so I instead used the [manual config example from the Gatsby docs](https://www.gatsbyjs.com/docs/debugging-the-build-process/#vs-code-debugger-manual-config) for that.

In my case, Gatsby was not in the root of my workspace, so I needed to make a few adjustments. For the client side configuration, I needed to change the webRoot to `"${workspaceFolder}/gatsby"`. Adjusting the Node configurations were a little trickier. Updating the path to the Gatsby binary alone didn't work because VS Code was launching the console from the root of the workspace, which wasn't a Gatsby project. Eventually after [digging around in the VS Code docs](https://code.visualstudio.com/docs/editor/variables-reference#_environment-variables) I found that you could set a current working directory option. Adding `"cwd": "${workspaceRoot}/gatsby"` to each of the Node configurations did the trick.

The resulting launch.json looked like this:

```json
{
    "version": "0.2.0",
    "configurations": [
        {
            "name": "Gatsby develop",
            "type": "pwa-node",
            "request": "launch",
            "program": "${workspaceRoot}/gatsby/node_modules/.bin/gatsby",
            "args": ["develop"],
            "runtimeArgs": ["--nolazy"],
            "console": "integratedTerminal",
            "cwd": "${workspaceRoot}/gatsby"
        },
        {
            "name": "Gatsby build",
            "type": "pwa-node",
            "request": "launch",
            "program": "${workspaceRoot}/gatsby/node_modules/.bin/gatsby",
            "args": ["build"],
            "runtimeArgs": ["--nolazy"],
            "console": "integratedTerminal",
            "cwd": "${workspaceRoot}/gatsby"
        }
        {
            "type": "chrome",
            "request": "launch",
            "name": "Client side in Chrome",
            "url": "http://localhost:8000",
            "webRoot": "${workspaceFolder}/gatsby"
        }
    ]
}
```
