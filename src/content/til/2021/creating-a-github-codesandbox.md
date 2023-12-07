---
title: Creating a CodeSandbox from a GitHub Repository
description: Need to quickly stand up a live example based on an existing repository? Creating a CodeSandbox for a GitHub repository couldn't be easier.
author: Brian
date: 2021-05-30T09:41:45.425Z
---
I recently had the need to post a live demo of a simple Create React App project that was posted on another user's GitHub repository. I typically turn to [CodeSandbox](https://codesandbox.io) for examples like this, but I didn't want to recreate the project from scratch since it already was good to go. I found that CodeSandbox has a ton of options to [import a Sandbox](https://codesandbox.io/docs/importing).

The easiest one in this case by far was using GitHubBox.com. From [their readme](https://github.com/dferber90/githubbox):

> Go to a repo in GitHub<br>Replace github.com with githubbox.com<br>There's no step three

So all I had to do was take this GitHub URL:

[https://github.com/aroseman/gdwc-react-demo/tree/main/](https://github.com/aroseman/gdwc-react-demo/tree/main/)

and change it to:

[https://githubbox.com/aroseman/gdwc-react-demo/tree/main/](https://githubbox.com/aroseman/gdwc-react-demo/tree/main/)

Which magically gave me this sandbox:

<iframe src="https://codesandbox.io/embed/github/aroseman/gdwc-react-demo/tree/main/?fontsize=14&hidenavigation=1&theme=dark"
  style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;"
  title="react-component-demo"
  allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
  sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
></iframe>

Super simple and super handy.