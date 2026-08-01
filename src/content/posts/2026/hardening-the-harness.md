---
title: "Hardening the Harness"
description: AI agents can pass your tests and still ship the wrong thing. Starting a series on the infrastructure that makes them reliable contributors.
author: Brian
date: 2026-07-09
---

Not long ago a coding agent opened a pull request against a side project I had been working on that seemingly did everything right. Tests green. Lint clean. Functionally it built the feature I'd asked for, more or less the way I would have built it myself. But it also reached straight across two workspace boundaries in the monorepo that should have been isolated. It was pretty obvious during code review: tests in the app shouldn't be importing from the extension. The agent had no way of knowing, because that rule just lived in my head. The agent wasn't the problem. The codebase was.

This is the first post in a series about closing that gap. The TL;DR: AI coding agents can write features, open PRs, and pass your test suite. What they can't do is read your mind, consult the architecture diagram you never drew, or notice that the button they just added is invisible on mobile. The fix isn't a cleverer prompt, and it isn't waiting for the next model. It's making the implicit stuff explicit, and making the explicit stuff machine-checkable.

I've been working all of this out on [More Later](https://www.morelater.app), a reading-and-collections app I build as a side project. It's also where I test new AI workflows before they become part of my day to day. It's a monorepo with a handful of workspaces, with both me and coding agents committing code, and over a few months the same class of problems kept showing up. Architecture violations that only surfaced in review. Docs that confidently answered questions about patterns I'd abandoned. Confusion about who owned a shared contract when it finally needed to change. So I started spending real time on the scaffolding around the code instead of just the code itself. Hardening the harness.

### Defining "harness"

The word has caught on, so it's worth pinning down. The cleanest definition I've seen comes from Vivek Trivedy at LangChain, in [The Anatomy of an Agent Harness](https://blog.langchain.com/the-anatomy-of-an-agent-harness/): _Agent = Model + Harness_. If you're not the model, you're the harness. The model does the thinking. The harness is everything else: the prompts, the tools, the file system, the rules, the feedback loops. Claude Code is a harness. Codex is a harness.

Most of that you don't control. But a big, underrated chunk of it you absolutely do, and that's your codebase plus the scaffolding you wrap around it. Call it the outer harness, the part that's specific to your repo. That's what this series is about.

Two distinctions make the rest of it easier to follow, and I'm borrowing both from Birgitta Böckeler's [Harness engineering for coding agent users](https://martinfowler.com/articles/harness-engineering.html), the clearest writeup of this I've found. The first is **guides versus sensors** (also referenced as feedforward and feedback controls). Guides steer the agent _before_ it acts: a convention in your `AGENTS.md`, a rule about which imports are allowed. Sensors catch problems _after_ it acts and feed them back so the agent can self-correct: a failing test, a linter, a screenshot. You want both. Guides without sensors, and the agent repeats the same mistake forever. Sensors without guides, and it keeps walking into the wall to confirm the wall is still there.

The second is **computational versus inferential**. Computational controls are deterministic and cheap: tests, type checks, structural rules. They run in milliseconds and they're always right. Inferential controls lean on a model's judgment: an AI reviewer, an LLM acting as a judge. Slower, more expensive, occasionally wrong, but able to catch things a regex never will. The challenge is putting the right kind of control in the right place.

And then there's the habit that ties it together, what Addy Osmani calls the [ratchet](https://addyosmani.com/blog/agent-harness-engineering/). Every time the agent makes a mistake, you don't just fix it and move on. You add a guide or a sensor so it can't make that mistake again. Most lines in my `AGENTS.md` trace back to something that actually went wrong. You don't download an outer harness. You accumulate one, one failure at a time.

### None of this is new

The same properties that make a codebase pleasant for humans make it legible for agents.

Clear boundaries. Single sources of truth. Explicit ownership. Visible outcomes. None of that is new advice. We've been telling each other to do it for years and quietly not doing it, because a human can paper over a messy codebase with experience and a decent memory. An agent can't. It exposes every place you were running on tribal knowledge. Which is annoying, sure, but it's also a bit of a gift: the work you do for the agent is the same work you'd been putting off for the humans.

### The layers

Each of these will get their own post. I'll link them up here as they go live.

- **[Architecture that enforces itself](/posts/2026/architecture-that-enforces-itself).** I moved from documented intentions to executable checks that fail the build. A dependency-cruiser config decides which workspaces are allowed to import from which, and a custom structural script enforces ownership rules (only one file may touch the service-role key, UI components can't reach into the API layer, and so on). An architecture violation now fails the PR on its own. No reviewer has to catch it, no one has to remember the rule.
- **[Documentation as a hierarchy, not a pile](/posts/2026/documentation-as-a-hierarchy).** My instructions file had grown into a monolithic catch-all, which is bad for humans and worse for agents. An agent can't skim. It reads the whole thing or it misses context. So I cut it down to a short table of contents that delegates to a scoped `docs/` tree, with one governing rule: no duplication between root and workspace docs. Project-wide stuff lives at the root, workspace-specific stuff lives in the workspace, and nowhere twice.
- **[Cross-workspace contract ownership](/posts/2026/cross-workspace-contract-ownership).** When a shared contract changed, it wasn't always obvious who owned it or who'd break. So I wrote each durable contract down with an owner and its consumers, plus a rule that changing a contract has to update every consumer's docs in the same PR. The ripple effects show up at PR time instead of as a bug in production three weeks later.
- **Visual verification.** Everything above makes agents write _correct_ code; none of it tells them what the thing _looks like_. An agent can pass every check and still ship an invisible button. Giving the agent eyes is the **behavior/outcome** harness, and it's often the hard one.
- **Inferential controls.** Deterministic checks catch structural problems. They can't tell you an abstraction is wrong or a test is quietly redundant. That's where a review agent earns its place, with one firm rule borrowed from the labs: don't let an agent grade its own homework. Separate the thing that writes from the thing that judges.
- **Observability the agent can read.** Structured logs and metrics legible enough that the agent can reason about how the app behaves at runtime, not just whether it compiles. This is the least-built layer in my own setup and the one I'm most curious about.
- **The harness as a system you steer.** The closer, on entropy and garbage collection. Agents replicate whatever patterns already exist, including the bad ones, so drift is inevitable and you need recurring cleanup that runs whether or not anyone remembers to do it. This is the part that makes it a practice instead of a one-time setup.

A harness isn't process for its own sake, and it isn't something you configure once and forget. It's the difference between hoping the agent gets it right and arranging things so it can't get them wrong in the ways that matter. Let's get into it.

_This post was co-authored with [my agent assistant, Ryan Terry](/ryan-terry)._
