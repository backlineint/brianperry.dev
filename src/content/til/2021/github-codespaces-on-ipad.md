---
title: Running GitHub Codespaces on an  iPad
description: GitHub Codespaces can provide a fully featured development
  environment on an iPad. Heres how I configured a Node environment to make
  updates to this site.
author: Brian
date: 2021-06-19T07:16:22.040Z
imagePath: ./github_codespace.png
alt: Editing a post using Codespaces on Safari iPadOS
---

I've been experimenting on and off with [GitHub Codespaces](https://github.com/features/codespaces) since gaining access to the beta. My long term goal is to set up an environment for Drupal contribution, similar to Ofer Shaal's great [ddev Gitpod](https://github.com/shaal/ddev-gitpod) project. In the meantime, I've used Codespaces for a slightly more frivolous pursuit.

I occasionally find myself using my iPad and wanting to do a small amount of coding, or a relatively minor update to this site. Codespaces finally makes this practical. You can update and commit code, run commands in a terminal, and even view your development site in Safari with live reload enabled. Paired with the [Magic Keyboard](https://www.apple.com/shop/product/MXQT2LL/A/magic-keyboard-for-ipad-pro-11-inch-3rd-generation-and-ipad-air-4th-generation-us-english-black) (speaking of frivolous) this setup can do a surprisingly good job approximating an honest-to-goodness local development setup.

Here's an overview of how I configured Codespaces in the repository for this site:

- In VSCode, download and enable the [remote containers plugin](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers) for VSCode. (Alternatively you could [download the appropriate dev container](https://github.com/microsoft/vscode-dev-containers/tree/main/containers), but the VSCode integration is really nice.)
- Hit F1 and search for 'Add Development Container Configuration Files...'
- Select a container configuration definition. In my case it was Node.
- Select your node version.
- This will create a .devcontainer directory in your project that contains a dockerfile and a configuration file. Commit these files to version control and push to your GitHub repository.
- In the Github Web UI on your iPad you should now be able to select 'Open with Codespaces' under the 'Code' dropdown button. From there you can create a new Codespace, or later launch one of your existing Codespaces.

In the future I'd like to automate a few things like installing node packages when the container starts up. I'm guessing that can just be added to the dockerfile.

Now that the iPad is running the same M1 chip as the MacBook, I have a suspicion (hope? dream?) that the line between MacOS and iPadOS will start to blur in some ways that will make web development on an iPad more practical. But in the meantime it is nice to have this option in repos where I might want to make quick updates without dragging out my big boy laptop.

**Update:** adding the development container that is most appropriate for your project has some advantages, but it turns out there is a much lower effort way to use a codespace on any repository. If you haven't added a .devcontainer folder to a repository, opening a codespace in the GitHub UI will use [the default development container](https://aka.ms/ghcs-default-image). This container has Python, Node.js, JavaScript, TypeScript, C++, Java, C#, F#, .NET Core, PHP, PowerShell, Go, Ruby, and Rust (phew.) Might be overkill, but probably has the tools you need to get started without any advance configuration.
