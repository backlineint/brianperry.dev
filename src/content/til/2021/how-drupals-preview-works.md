---
title: How Drupal's Preview Works
description: I recently needed to dig into the specifics of how Drupal's node
  preview actually worked only to find that all of my assumptions were wrong.
author: Brian
date: 2021-10-08T01:28:50.252Z
tags:
  - drupal
---
I've been thinking quite a bit recently about Drupal's options for decoupled preview with other JavaScript front ends. As part of some related experimentation, I found myself needing to understand more about how Drupal's standard preview functionality works. To be specific here - I'm talking about when you're editing a node and click on the preview button to see a full rendering of the page you're currently editing.

I realized I had never really had any reason to think about how that actually happens. Like many things on the web, it just kind of magically does. My general assumption was that it was some variation of Drupal's revision functionality. Something along the lines of an unpublished version of the node is created to represent the preview, and then is deleted after some period of inactivity.

As I dug into the code a bit I found out that my assumption was pretty far off.

Surprise number one was that the data for this is stored in Drupal's tempstore. Specifically [Drupal's private tempstore](cms/til/how-drupals-preview-works). The tempstore is a key/value collection that can make data available across requests and the private tempstore also includes checks to ensure that the data is only available to the current user. Here's a short post with [a good comparison of the private tempstore and the shared tempstore](https://alexrayu.com/snippets/drupal-8-tempstore).

Surprise number two was that the form state of the current node edit form is what is stored in the tempstore, not the node entity itself. As we'll see in a second, it is possible to derive the node entity from the form state, but technically only the form ends up in the tempstore.

Let's take a peek at some of the relevant code.

When the node edit form is submitted, the following form submit handler is used:

```php
// From core/modules/node/src/NodeForm.php

/**
 * Form submission handler for the 'preview' action.
 *
 * @param $form
 *   An associative array containing the structure of the form.
 * @param $form_state
 *   The current state of the form.
 */
public function preview(array $form, FormStateInterface $form_state) {
  $store = $this->tempStoreFactory->get('node_preview');
  $this->entity->in_preview = TRUE;
  $store->set($this->entity->uuid(), $form_state);

  $route_parameters = [
    'node_preview' => $this->entity->uuid(),
    'view_mode_id' => 'full',
  ];

  $options = [];
  $query = $this->getRequest()->query;
  if ($query->has('destination')) {
    $options['query']['destination'] = $query->get('destination');
    $query->remove('destination');
  }
  $form_state->setRedirect('entity.node.preview', $route_parameters, $options);
}
```

Here the form is being set in the private tempstore, and the user is redirected to the preview route.

Before the preview route is rendered, the node preview service will be invoked. Within this service the `convert` method gets the form state from the tempstore and then derives the node entity form that.

```php
// core/modules/node/src/ParamConverter/NodePreviewConverter.php

public function convert($value, $definition, $name, array $defaults) {
  $store = $this->tempStoreFactory->get('node_preview');
  if ($form_state = $store->get($value)) {
    return $form_state->getFormObject()->getEntity();
  }
}
```

Finally, within the node preview controller, the `view` method assembles a build of the node.

```php
// core/modules/node/src/Controller/NodePreviewController.php

public function view(EntityInterface $node_preview, $view_mode_id = 'full', $langcode = NULL) {
  $node_preview->preview_view_mode = $view_mode_id;
  $build = parent::view($node_preview, $view_mode_id);

  $build['#attached']['library'][] = 'node/drupal.node.preview';

  // Don't render cache previews.
  unset($build['#cache']);

  return $build;
}
```

Pretty much everyone I ran this by was surprised*, but now that I've worked through it a bit this approach makes more sense to me. Many of these previews will be abandoned, so the tempstore actually is an appropriate home for them due to its built in expiration and cleanup. Same for the private tempstore - previews are specific to the current user, and could contain sensitive data. Finally, I'd imagine that not processing this as a full entity/revision saves some overhead considering that this preview could be updated frequently while editing.

I now understand the 'how' and possibly the 'why', but that doesn't make it any easier to access this data for other preview related purposes. I think that is the reason why this specific use case is covered by few, if any, decoupled Drupal preview solutions. From my initial experimentation it can be solved, but it will take quite a bit of work to do right.

I'd love to hear more from those managing decoupled Drupal sites. Is previewing in your decoupled front end while editing in Drupal really the holy grail it seems like sometimes? Or are other preview workflows meeting your needs?

\* *I'm sure there are some Drupal lifers out there who were well aware of this, and are yelling at their screens right now.*