---
title: Configuring Tugboat Live Previews For Drupal General Projects
description: A quick example of how to set up Tugboat Live Previews for a
  general project on drupal.org that uses NodeJS.
author: Brian
date: 2021-04-27T18:23:13.947Z
tags:
  - drupal
---
[I've written previously](/posts/2021/were-in-the-golden-age-of-contributing-to-drupal/) about my excitement that Tugboat now offers live previews for core and contrib merge requests on Drupal.org, so I was especially happy to see live previews added to the [Generic Drupal Web Components (GDWC)](https://www.drupal.org/project/gdwc) project recently.

GDWC is a [general project](https://www.drupal.org/project/project_general) on Drupal.org and runs using NodeJS rather than PHP. Since Tugboat runs on Docker it seemed likely that we could also run Node, but [the existing documentation](https://www.drupal.org/docs/develop/git/using-git-to-contribute-to-drupal/using-live-previews-on-drupal-core-and-contrib) is unsurprisingly focused on Drupal PHP projects.

With a little experimentation we found that Tugboat Live Previews could in fact be easily configured to run for Node based projects as well. Almost all of the credit here goes to [Joe Parsons](https://www.drupal.org/u/joegraduate) who took the lead on [this issue](https://www.drupal.org/project/gdwc/issues/3207881). We ended up adding `.tugboat/config.yml` to the project with the following contents:

```yml
services:
  apache:
    image: tugboatqa/httpd:2.4
    default: true
    commands:
      init:
        - curl -fsSL https://deb.nodesource.com/setup_lts.x | bash -
        - apt-get install -y nodejs
      build:
        - npm install
        - npm run build-storybook
        - ln -snf "${TUGBOAT_ROOT}/storybook-static" "${DOCROOT}"
```

As you can see above, this first installs Node on Tugboat's httpd image. We can then install our dependencies and run a static build of [Storybook](https://storybook.js.org/docs/web-components/get-started/introduction), which is the primary development tool used by the project. The last step symlinks our build asset to the document root on the image so that it will display when someone views a live preview.

It feels like [a more lightweight Node image could serve a similar purpose](https://www.drupal.org/project/gdwc/issues/3208848), but this solution meets our needs for now and builds in a reasonable amount of time.

Thanks again to all who helped make these live previews possible - they have already simplied the review process for this project.