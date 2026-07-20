---
title: "Architecture That Enforces Itself"
description: A document is a description of intent. It doesn't stop anything. How to turn architectural rules into checks that fail the build.
author: Brian
date: 2026-07-20
---

In the [first post of this series](/posts/2026/hardening-the-harness), I told on myself a little: an agent opened a PR that crossed a workspace boundary, and the only reason that boundary existed was that I knew about it. It wasn't written down anywhere a machine could check. It was a rule in my head.

The obvious fix is to write it down. So you add a line to your architecture doc that says the app doesn't import from the extension, you feel good about yourself, and then three weeks later something imports from the extension anyway. Because a document is a description of intent. It doesn't actually stop anything. It sits there, being correct, while the codebase quietly drifts away from it.

This is the first layer of hardening the harness, and it's the one with the best effort-to-payoff ratio: take the architectural rules that currently live in your head (or in a doc nobody re-reads) and turn them into checks that fail the build.

### Documented intentions versus executable checks

The idea of encoding architectural properties as automated checks isn't new, and it's worth naming properly. It's what Neal Ford, Rebecca Parsons, and Patrick Kua call an _architectural fitness function_ in [Building Evolutionary Architectures](https://evolutionaryarchitecture.com/): a check that measures whether the system still has the properties you care about as the code changes underneath you. Borrowed from evolutionary biology.

The insight has been around since 2017. What's changed is the urgency. A human contributor who's been on the project a while absorbs your architecture by osmosis, and mostly stays inside the lines out of habit and a vague fear of code review. An agent has neither the habit nor the fear. It has your files and whatever you told it. If a boundary isn't checkable, it isn't real.

So in [More Later](https://www.morelater.app) I added a `tools/architecture/` directory with two things in it. One handles the boundaries between workspaces. The other handles ownership rules inside them.

### Boundaries: dependency-cruiser

The monorepo has five workspaces: `app/`, `ai/`, `extension/`, `site/`, and `supabase/`. The rule is boring and absolute. None of them import from each other. They talk over HTTP routes and the database, not by reaching into each other's source.

[dependency-cruiser](https://github.com/sverweij/dependency-cruiser) turns that into policy. The whole config is five rules that look like this:

```js
{
  name: 'app-no-cross-workspace-imports',
  comment:
    'The Expo app must stay isolated from other workspaces at import time.',
  severity: 'error',
  from: { path: '^app/' },
  to: { path: '^(ai|extension|site|supabase)/' },
}
```

Five of those, one per workspace, and the boundary I'd been enforcing with vibes is now enforced by a tool. That's it. It took about twenty minutes and it would have caught the PR that started this whole series.

Here it is doing its job on a real run:

![GitHub Actions log showing the architecture:check step failing. dependency-cruiser reports "error app-no-cross-workspace-imports: app/__tests__/extensionPopupAuth.test.ts → extension/entrypoints/popup/authHandlers.ts" followed by "1 dependency violations (1 errors, 0 warnings). 202 modules, 203 dependencies cruised."](./architecture-check-ci-failure.png)

One violation out of 203 dependencies cruised, and the build stops. Note what tripped it: a _test_ in `app/` reaching into the extension. Not application code, and not something I'd have thought to look for in review.

### Ownership: a few hundred lines of Node

Boundaries between workspaces can be straightforward. The more challenging rules are about ownership _inside_ a workspace.

A good example from this project is the [Supabase](https://supabase.com) service-role key. It bypasses row-level security, so anything holding it can read and write anything. Exactly three files in the entire repo have any business touching it. That is a rule I care about enormously and that no linter ships with.

So `check-structure.mjs` is a plain Node script that walks the source tree and checks a small set of these. Right now it enforces eleven rules, including:

- Only three designated modules may read the service-role key
- Only a fixed list of modules may construct a Supabase client at all
- App components and hooks can't import `lib/api/*` clients directly
- `app/lib` can't import from routes, components, hooks, or context (it stays reusable)
- [Mastra](https://mastra.ai/) agents can't import workflows, tools can't import agents or workflows, and workflows can't import other workflows

That last cluster is the layering inside the AI workspace, which is exactly the kind of convention that used to exist only as something I'd explain to someone (or to a model) when they got it wrong.

When something trips, you get this:

```
Architecture structural checks failed:

- service-role-key-ownership: app/lib/feed.ts
  Only dedicated service-role Supabase owner modules may read service-role Supabase keys.
```

### The error message is talking to the agent

Look at that output again. There's a rule name, a file, and then a sentence explaining what the rule actually wants.

That sentence is not really for me. I know what the rule wants. That sentence is for whoever, or whatever, has to fix it. When an agent runs the check and it fails, that remediation text lands directly in its context, and the agent now knows both that it broke something and what the correct shape looks like. It fixes it and moves on without me.

Böckeler calls this ["a positive kind of prompt injection"](https://martinfowler.com/articles/harness-engineering.html), which is the best possible name for it. [OpenAI's team makes the same point](https://openai.com/index/harness-engineering/): because their lints are custom, they write the error messages specifically to inject remediation instructions into the agent's context.

In the vocabulary from the first post, this is where a check stops being just a _sensor_ and starts doing the work of a _guide_ too. It doesn't only detect the mistake. It tells you the rule. Every custom check you write is a chance to do this, and it costs you one extra string.

### Wiring it to the build

None of this matters if it doesn't block anything. The two tools run together:

```json
"architecture:deps": "dependency-cruiser --config tools/architecture/depcruise.cjs app ai extension site supabase",
"architecture:structure": "node tools/architecture/check-structure.mjs",
"architecture:check": "pnpm architecture:deps && pnpm architecture:structure",
```

And `architecture:check` is part of `ci:verify`, which is what CI runs on every PR. So an architecture violation now fails the PR on its own. Nobody has to notice it in review. Nobody has to remember the rule existed. The check is the memory.

Before, "don't do that" was a thing I had to be present and paying attention to enforce. Now it's a property of the repo. It works while I'm asleep, which helps a lot when I've kicked off a few Codex cloud tasks before bed.

### Start with what's always wrong

The temptation with this stuff is to go build a general architecture linting framework. Resist it. My enforcement doc literally says "Phase 1," and Phase 1 was deliberately the rules that are _always_ wrong and _cheap_ to check. Deterministic first. No heuristics, no scoring, no "this looks suspicious."

The README I wrote for the tooling has this line:

> Expand this ruleset conservatively. Prefer a small number of quiet, high-signal failures over a broad noisy policy.

A noisy check gets ignored, and a check everyone ignores is worse than no check, because now you also have a false sense of security.

And when you're not sure a rule is ready to block? Don't make it block. I run a second, advisory tier of checks that just warn while I watch whether the signal is any good, and rules graduate into the blocking set only once they've earned it. I plan on elaborating on this concept later in the series.

### You don't have to hand-roll all of it

Everything above is custom code, which is fine when a rule is a pattern match. But it's worth being honest about the ceiling. A deterministic check can only enforce what you can express as a pattern. "Only these three files touch the service-role key" is easy. "This change quietly breaks the pattern we agreed on for composing workflows" is not something I can grep for. And every one of these checks assumes I already knew the rule well enough to write it down, which is precisely the assumption that failed me in the first place.

There's a class of tools emerging to close that gap, and they come at it from the opposite direction. Instead of you writing the checks, they read the codebase, infer the architectural decisions already living in it, and keep those decisions in front of the agent: captured as decision records, synced into the context files agents actually read like `CLAUDE.md` and `AGENTS.md`, then used to review pull requests. Most AI review tools look at the diff. This category looks at the diff against your architecture.

Full disclosure: one of these is [Actual AI's Architecture Agent](https://www.actual.ai/agents/architecture-agent), which is what I work on at my day job. Weight my enthusiasm accordingly.

The part I find genuinely interesting isn't which tool you pick. It's that this is the _inferential_ half of the same idea. My scripts are computational: fast, deterministic, and dumb. Judgment-shaped rules need a model to evaluate them. Same job, different instrument, and there's a post later in this series about where each one belongs.

### Every rule is a scar

Here's the thing I didn't expect. Go back through those eleven rules and every single one is a fossil. The service-role-key rule exists because it once ended up somewhere it shouldn't have. The agents-don't-import-workflows rule exists because it's easy to forget what you created as a tool, an agent, or a workflow. The `lib/api` rule exists because a component reached straight past three layers to grab data and I didn't catch it until it broke.

That's the ratchet from the first post, in its most literal form. I didn't sit down and design an architecture policy. I got burned, wrote a check so it couldn't happen again, and went back to work. The policy is just the accumulated residue of things that already went wrong.

Which is genuinely good news if you're staring at your own codebase wondering where to start. You don't need a grand architectural vision. You need to remember the last three things an agent (or a human, honestly) did that made you sigh. Write a check for those. That's Phase 1.

_This post was co-authored with [my agent assistant, Ryan Terry](/ryan-terry)._
