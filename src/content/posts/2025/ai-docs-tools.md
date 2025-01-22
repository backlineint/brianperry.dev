---
title: Using AI Tools to Improve the Maintainability of the Next.js for Drupal Documentation
description: How we leveraged AI to make a documentation maintainability improvement possible today.
author: Brian
date: 2025-01-22
---

The 2.0 release of Next.js for Drupal introduces support for the Next.js App Router, and thus required a significant update to the documentation. The Next.js docs themselves show some of this complexity as each page can be toggled between versions for the App Router, Pages Router, and past major versions of Next.js.

Sometimes you just have to grin and bear it. And the bulk of the updates were taken care of by an excellent community contribution by {NAME}. But in reviewing these updates it became clear that one specific area of the docs was going to be a challenge to maintain moving forward.

- Reference - copy and pasted code, identical options on many methods, etc.
- Want to use Typedoc for this, but how - we don't actually have good code comments in the codebase.
- First pass - Copilot Workspaces
- Manual intervention to resolve dependency conflict.
- Initial feedback - we're losing too much useful info.
- Second pass - more side by side work with VSCode Copilot Edits
