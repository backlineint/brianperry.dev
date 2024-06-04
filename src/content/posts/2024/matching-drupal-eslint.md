---
title: Matching Drupal’s GitLab CI ESLint Configuration in a Contrib Module
description: After adding GitLab CI to a Drupal contrib module, our JavaScript linting was passing locally but failing in CI. Here's how I ensured the local configuration matched the CI.
author: Brian
date: 2024-06-03
tags:
  - drupal
---

The Drupal Association now maintains a [GitLab CI Template](https://git.drupalcode.org/project/gitlab_templates/-/blob/main/gitlab-ci/template.gitlab-ci.yml) that can be used for all Drupal contrib projects. It's an excellent way to quickly take advantage of Drupal.org's CI system and ensure your project is following code standards and best practices. And using it has the bonus of giving you a sweet green checkmark on your project page!

![A release with a green check mark](./green-check.png)

We recently added this template to the [Same Page Preview](https://www.drupal.org/project/same_page_preview) module. After doing so, our JavaScript linting was failing. This wasn't surprising since we hadn't yet committed a standard ESLint or Prettier configuration to the codebase. I took a shot at trying to resolve these linting issues, initially turning to the [ESLint Drupal Contrib plugin](https://www.npmjs.com/package/eslint-plugin-drupal-contrib). This allowed me to get ESLint up and running quickly and easily run linting with only within the context of this module. I resolved all of the linting issues, pushed my work up to GitLab, and started thinking about how I'd reward myself for a job well done.

### Disaster Strikes

And as you might expect, the CI build failed. 🤦‍♂️ (Copilot suggested this emoji. Good job Copilot.)

At this point I took a step back. First off, I needed to determine what differed between my ESLint process and the one that was being executed by the Drupal Gitlab CI Template. Secondly, beyond just getting the CI job to pass, I wanted to define what linting use cases I was trying to solve for. I decided to focus on the following:

1. Determining how to run the exact same ESLint command that the GitLab CI Template was running, using the same configuration as Drupal Core.
2. Developing an ESLint configuration that could be run within the standalone module codebase (with or without an existing instance of Drupal) but matching Drupal Core and GitLab CI's configuration as closely as possible.

### Using the Drupal Core ESLint Configuration

Here we literally want to use the same ESLint binary and config used by Drupal Core. Since this is what Drupal's GitLab CI Template is doing, this is also an opportunity to match the CI linting configuration as closely as possible.

The CI job is running the following command:

```bash
$ $CI_PROJECT_DIR/$_WEB_ROOT/core/node_modules/.bin/eslint \
  --no-error-on-unmatched-pattern --ignore-pattern="*.es6.js" \
  --resolve-plugins-relative-to=$CI_PROJECT_DIR/$_WEB_ROOT/core \
  --ext=.js,.yml \
  --format=junit \
  --output-file=$CI_PROJECT_DIR/junit.xml \
  $_ESLINT_EXTRA . || EXIT_CODE_FILE=$?
```

And prior to that command, symlinks are also created for some relevant configuration files:

```bash
$ cd $CI_PROJECT_DIR/$_WEB_ROOT/modules/custom/$CI_PROJECT_NAME
$ ln -s $CI_PROJECT_DIR/$_WEB_ROOT/core/.eslintrc.passing.json $CI_PROJECT_DIR/$_WEB_ROOT/modules/custom/.eslintrc.json
$ ln -s $CI_PROJECT_DIR/$_WEB_ROOT/core/.eslintrc.jquery.json $CI_PROJECT_DIR/$_WEB_ROOT/modules/custom/.eslintrc.jquery.json
$ test -e .prettierrc.json || ln -s $CI_PROJECT_DIR/$_WEB_ROOT/core/.prettierrc.json .
$ test -e .prettierignore || echo '*.yml' > .prettierignore
```

This means that we'll need to run eslint using Core's 'passing' configuration (which itself extends the 'jquery' configuration.)

To match that, I created an `eslint:core` command in the module's `package.json`:

```json
{
  "scripts": {
    "eslint:core": "../../../core/node_modules/.bin/eslint . \
      --no-error-on-unmatched-pattern \
      --ignore-pattern='*.es6.js' \
      --resolve-plugins-relative-to=../../../core \
      --ext=.js,.yml \
      -c ../../../core/.eslintrc.passing.json"
  }
}
```

I was surprised to find that even after running this command locally, the CI job was still failing. It turned out that ESLint wasn't using Core's Prettier config in this case, resulting in a different set of formatting rules being applied. Copying `core/.prettierrc.json` into the module's root directory resolved this issue.

Copying Core's prettier config wholesale isn't great. The approaches to referencing and extending a prettier config are clunky, but possible. A more ideal solution would be to have Drupal's prettier config as a package that could be referenced by both Core and contrib modules.

### Using a Standalone ESLint Configuration

Ideally it would also be possible to run this linting outside of the context of Drupal Core. This could help speed up things like commit hooks, some CI tasks, and also make quick linting checks easier to run. With the lessons from using Drupal Core's ESLint configuration, I took another shot at using the `eslint-plugin-drupal-contrib` plugin.

First, I installed it as a dev dependency:

```bash
npm i -D eslint-plugin-drupal-contrib
```

Next, I created a file `.eslintrc.contrib.json` in the module's root directory:

```json
{
  "extends": ["plugin:drupal-contrib/passing"]
}
```

This will result in eslint using the same configuration as Drupal Core's 'passing' configuration, but without needing to reference Core's configuration files. Finally, you can run this by adding the following `eslint` script in the module's `package.json`:

```json
{
  "scripts": {
    "eslint": "eslint . \
      -c .eslintrc.contrib.json \
      --no-eslintrc"
  }
}
```

You might be surprised to see the `--no-eslintrc` flag above. That prevents ESLint from looking for any other configuration files in the directory tree. Without it, ESLint will find the Drupal Core configuration files if this happens to be run from within a Drupal project.

Also note that ESLint 8.x uses the `--no-eslintrc` flag, while the ESLint 9.x equivalent is `--no-config-lookup`

### Happy Linting

Ran into a few more hiccups than I expected along the way, but I now feel confident that I can have consistent linting results between my local environment and the Drupal.org CI system in all of the JavaScript code I write for Drupal contrib modules. I hope this helps you do the same!

### Resources

- [Drupal GitLab CI Template](https://git.drupalcode.org/project/gitlab_templates/-/blob/main/gitlab-ci/template.gitlab-ci.yml)
- [ESLint Drupal Contrib plugin](https://www.npmjs.com/package/eslint-plugin-drupal-contrib)
