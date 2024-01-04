---
title: Running Lando on an Apple Silicon Mac
description: While I've done some development on my M1 MacBook, I had been
  procrastinating on doing any Docker based development. Decided to take the
  plunge today.
author: Brian
date: 2021-02-20T20:23:29.236Z
---

While I've done some NodeJS based development on my M1 MacBook, I had been procrastinating on doing anything Docker based. I had an opportunity to take the plunge today and decided to go for it.

My understanding is that [this config is not officially supported](https://github.com/lando/lando/issues/2688) for a variety of reasons, ~~but for me it pretty much just worked~~.

Here's what I did:

- Downloaded and installed the [Docker M1 Tech Preview](https://docs.docker.com/docker-for-mac/apple-m1/)
- Downloaded the latest [Lando release](https://github.com/lando/lando/releases) (3.0.25 in my case)
- Installed Lando, being sure to customize the install to not install Docker Desktop over my existing tech preview.
- Created and started a Drupal 9 project ~~that just worked~~.

If I run into any quirks as I put it through the paces a bit more, I'll update this post.

**Update**: Quirks already :)

Upon further restarts things seemed to be getting hung up on the message `Scanning to determine which services are ready... Please standby... ?` I was able to get past this by adding the following to `.lando.yml` [as mentioned in this issue](https://github.com/lando/lando/issues/2281#issuecomment-632620604):

```yml
services:
  appserver:
    scanner: false
```

It works, but indicates that there is some mystery issue under the covers. So as the Lando installer says when I install using an existing version of Docker: YMMV.
