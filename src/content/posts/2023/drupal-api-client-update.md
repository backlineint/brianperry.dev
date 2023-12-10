---
title: An Update on The Drupal API Client
description: The Drupal API Client Project has made substantial progress, including publishing our first POC release.
author: Brian
date: 2023-11-09
tags:
  - drupal
---

At [DrupalCon Pittsburgh](https://events.drupal.org/pittsburgh2023), a team of interested community members submitted [The Drupal API Client Project](https://www.drupal.org/project/api_client) to be considered for funding as part of the [Pitchburgh Innovation Contest](https://www.drupal.org/innovation/pitchburgh-2023). (If you missed it, check out our pitch video below, along with the [original proposal](https://docs.google.com/document/d/1MAUCgxJmSHxA6ozVXp6U49UMPF3sJPrInz1rnl9Wf_4/edit?pli=1#heading=h.9531ycwaflet).)

<iframe src="https://www.youtube.com/embed/EdTnrPZUW98?si=qSF4Kml7J9p9HFMh" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>

While competing community maintained API clients exist, Drupal does not offer any official JavaScript utilities to simplify the process of consuming data outside of the CMS. Our goal is to assemble a group of contributors to combine the best of existing Drupal API clients into a set of utilities that can both address common use cases with little configuration, and also be extended to support the needs of a diverse JavaScript ecosystem.

We were [lucky enough to be selected](https://youtu.be/tNa4XKb3zds?si=di_9WNupphYQrnPi&t=4995) by a panel of judges and the Drupal community to recieve funding. Since then, we've made some exciting progress on making our pitch a reality and wanted to share some updates.

### Initial Goals and Vertical Slice POC

Our initial focus is what we've been calling the [vertical slice POC](https://www.drupal.org/project/api_client/issues/3365506)  for our JSON:API Client. As a checkpoint on the way to our eventual 1.0 release, we saw value in focusing deeply on a narrow portion of the client. Specifically, we decided to focus on the ability to get a collection of resources from the API.

Alongside that functionality, we also wanted to cover some level  of implementation for all of our planned configuration options:

- Custom fetch method [#3376929](https://www.drupal.org/project/api_client/issues/3376929)
- Authentication (basic authentication for the POC) [#3376937](https://www.drupal.org/project/api_client/issues/3376937)
- Local caching [#3377144](https://www.drupal.org/project/api_client/issues/3377144)
- Deserialization of API responses [#3377191](https://www.drupal.org/project/api_client/issues/3377191)
- Basic localization support [#3377803](https://www.drupal.org/project/api_client/issues/3377803)
- Adding query parameters to API requests [#3383578](https://www.drupal.org/project/api_client/issues/3383578)

Going this deep on our method to get a collection should provide groundwork that will help simplify the remaining implementation on the way to 1.0. And possibly more importantly, having a functional POC early should allow us to engage with the community and gather real world feedback.

### 0.1.0 Release

Speaking of the POC, we're excited to announce that [we've published our first release](https://www.npmjs.com/package/@drupal-api-client/json-api-client)! You can install it right now using npm (or your package manager of choice):

```bash
npm i @drupal-api-client/json-api-client
```

[API documentation for the package](https://project.pages.drupalcode.org/api_client/modules/_drupal_api_client_json_api_client) is available on GitLab pages.

Included below is a CodeSandbox including a simple example of using the client to get a collection of nodes from a Drupal site. Feel free to fork it and play around!

<iframe src="https://codesandbox.io/embed/drupal-api-client-json-api-client-basic-example-54t589?fontsize=14&hidenavigation=1&module=%2Fsrc%2Findex.mjs&theme=dark&view=editor"
     style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;"
     title="@drupal-api-client/json-api-client Basic Example"
     allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
     sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
   ></iframe>

For the more adventurous, here's a live TypeScript example from our project readme that demonstrates more of the available configuration options:

<iframe src="https://codesandbox.io/embed/drupal-api-client-json-api-client-configuration-options-4wyqrw?fontsize=14&hidenavigation=1&module=%2Fsrc%2Findex.ts&theme=dark&view=editor"
     style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;"
     title="@drupal-api-client/json-api-client Configuration Options"
     allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
     sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
   ></iframe>

This 0.1.0 release represents the initial POC, but we're planning on having continued 0.x releases as we approach 1.0.

Thanks to [all who contributed to this release](https://git.drupalcode.org/project/api_client/-/graphs/canary?ref_type=heads), including: [coby.sher](https://www.drupal.org/u/cobysher), [pratik_kamble](https://www.drupal.org/u/pratik_kamble), [mitchellmarkoff](https://www.drupal.org/u/mitchellmarkoff), [shrutishende](https://www.drupal.org/u/shrutishende), [elber](https://www.drupal.org/u/elber), [abhisekmazumdar](https://www.drupal.org/u/abhisekmazumdar), [alexmoreno](https://www.drupal.org/u/alexmoreno) and the many others who provided feedback in the issue queue or dropped in on one of our Slack meetings.

### Obligatory Call for Help

The Drupal API Client Project is rolling along, but we're still looking for help from the community to make it a success. With the release of this POC, one of the biggest areas we need help is getting general feedback on our work thus far. The wider the feedback we get from the community, the better chance we have to ship something that meets a wide array of decoupled Drupal use cases.

We've created a [feedback issue](https://www.drupal.org/project/api_client/issues/3383579) to help guide the conversation, but we're also open to feedback in any form. We're you able to get up and running? Does the current API make sense to you? Is there a particular use case you're hoping to see supported? Let us know!

You also may have noted that many of our primary contributors work together at [Pantheon](https://pantheon.io/). While we greatly appreciate Pantheon's support and sponsorship of this project, we're also looking for help from the broader community. We're doing a decent job keeping focused on the generic use cases that this project is intended to solve, but having a more diverse array of contributors can only help the end result.

If you're interested in contributing, check out our [project page](https://www.drupal.org/project/api_client) on Drupal.org, and join us in the [#api-client](https://www.drupal.org/community/contributor-guide/reference-information/talk/tools/slack) channel on Drupal Slack.

And if you happen to be interested and on the East Coast, I'll be at [NedCamp](https://nedcamp.org) - both at the contribution day, and [presenting on the API Client project](https://nedcamp.org/sessions/2023/drupal-api-client-project) during session day. Come say hi!