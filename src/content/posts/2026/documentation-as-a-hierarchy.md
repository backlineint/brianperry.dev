---
title: "Documentation as a Hierarchy, Not a Pile"
description: A big instructions file is a bad interface for an agent, because an agent can't skim. How I turned one junk-drawer AGENTS.md into a table of contents with a docs tree underneath.
author: Brian
date: 2026-07-26
---

The [last post](/posts/2026/architecture-that-enforces-itself) was about the checks that run without me: the deterministic, computational half of the harness. This one is about the other half of what I hand an agent before it writes a line of code. Not the sensors that catch it after the fact, but the guides that steer it up front. The docs.

For a long time my docs were one file. A single `AGENTS.md` at the root of the repo that had quietly turned into a junk drawer. Setup instructions, naming conventions, the deploy dance, a note about which env vars matter, three paragraphs about a workflow pattern I'd since abandoned. Every time something confused an agent, I added a paragraph. It felt responsible. It was making things worse.

### A pile is a bad interface for an agent

A big instructions file is bad for humans and worse for agents, and it's worse for a specific reason: an agent can't skim.

When you open a 600-line onboarding doc, you don't read it. You scan the headers, find the one section you need, and ignore the rest. That skimming instinct is doing an enormous amount of work, and an agent doesn't have it. It reads the whole thing, or it reads whatever fits and quietly drops the rest, and either way the one instruction you cared about is now competing with 500 lines that weren't relevant to this task.

That was my file. I'd been so busy making sure everything was written down _somewhere_ that I'd made none of it findable. The monolith wasn't a harness. It was a way of hiding a dozen useful sentences inside a document that nobody, human or model, was going to read carefully.

### Table of contents, not encyclopedia

The fix is the same move [OpenAI landed on](https://openai.com/index/harness-engineering/): "instead of treating `AGENTS.md` as the encyclopedia, we treat it as the table of contents."

So the root `AGENTS.md` in [More Later](https://www.morelater.app) is now about seventy lines, and it doesn't really explain anything. It orients. Here's the shape of the repo, here are the few rules that are truly global, and here's where to go for everything else. Mostly it's link tables:

```markdown
# AI Agent Guidelines

Short index to project rules and patterns. Details live in the **`docs/`**
directory (and workspace `docs/` where noted).

## Tooling and workflow

| Topic                             | Description                                                                |
| --------------------------------- | -------------------------------------------------------------------------- |
| docs/package-management.md        | Use `pnpm`; Expo modules via `pnpm dlx expo install`.                      |
| docs/rule-porting-policy.md       | Add rules to `docs/` or workspace `docs/`; keep AGENTS.md in sync.         |
| docs/workspace-agent-docs.md      | Hierarchical pattern: when and how to use workspace `AGENTS.md` + `docs/`. |
| docs/cross-workspace-contracts.md | Which workspace owns which durable contracts.                              |
| docs/architecture-enforcement.md  | Repo-level deterministic architecture checks and CI entrypoints.           |

## Workspace-level guidelines

| Workspace           | Purpose                                                 |
| ------------------- | ------------------------------------------------------- |
| app/AGENTS.md       | Expo app: navigation, NativeWind, screens.              |
| ai/AGENTS.md        | Mastra agents, workflows, tools.                        |
| extension/AGENTS.md | Browser extension; points to root.                      |
| supabase/AGENTS.md  | Supabase schema, RLS, migrations, local DB conventions. |
```

(That's trimmed; the real file has a couple more rows and a "where things live" section at the bottom.)

What the table of contents buys you is progressive disclosure. The agent starts from a small, stable entry point and follows a pointer to exactly the scope it needs. Give it a map, not a manual, and let it walk to the part of the territory the task actually touches.

### The tree underneath

The table of contents delegates in two directions. Project-wide knowledge goes to a root `docs/` folder. Workspace-specific knowledge goes to a per-workspace `AGENTS.md` that delegates again into that workspace's own `docs/`.

```
.
├── AGENTS.md                        # ~70-line index (CLAUDE.md just points here)
├── ARCHITECTURE.md
├── docs/                            # project-wide, 9 files
│   ├── architecture-enforcement.md
│   ├── cross-workspace-contracts.md
│   ├── garbage-collection-audits.md
│   ├── rule-porting-policy.md
│   ├── workspace-agent-docs.md
│   └── ...
├── ai/
│   ├── AGENTS.md                    # AI workspace index
│   └── docs/                        # agents, workflows, schemas, conventions (6 files)
│       └── conventions.md
├── app/
│   ├── AGENTS.md
│   └── docs/
├── extension/
│   ├── AGENTS.md
│   └── docs/
└── supabase/
    ├── AGENTS.md
    └── docs/
```

An agent working in `ai/` loads the root index, sees it's about to touch the AI workspace, opens `ai/AGENTS.md`, and pulls in `ai/docs/conventions.md`. It never has to read a word about the browser extension's build setup, because that lives two directories away in a scope it had no reason to open. The context window fills with the things that matter to the task in front of it.

### Preventing duplication

A hierarchy like this has a potential failure mode: the same fact ends up in three places, they drift, and now the agent gets contradictory instructions depending on its entry point. I address this with a rule. From the doc that defines the pattern (`workspace-agent-docs.md`, yes, I wrote a doc about how to write docs):

> **No duplication:** Workspace AGENTS.md should _point to root_ for global topics (pnpm, navigation, styling) and only list workspace-specific docs.

Project-wide knowledge lives at the root and gets _linked_ from the workspaces that care. Workspace-specific knowledge lives in the workspace and nowhere else. If I'm ever tempted to copy a paragraph from one into the other, that temptation is the signal I've filed it in the wrong place to begin with.

The reason this earns a written rule is that "where does this piece of knowledge live" is a decision an agent makes every single time it adds a doc. If I don't answer it, the agent answers it differently every time, and six weeks later I've got the same convention described three ways in three files.

### What isn't written down doesn't exist

The deeper reason to do any of this is a line from that same OpenAI post I keep coming back to: "From the agent's point of view, anything it can't access in-context while running effectively doesn't exist."

So much of what matters about a project never makes it into the repo. Why I ruled out the obvious approach, the constraint that makes a clean-looking refactor a bad idea, the reason a file is weird on purpose. I carry all of that around in my head, and because I remember it, I never feel the need to write it down. That works right up until the contributor is an agent, which has none of it and no way to ask, so it happily re-proposes the thing I rejected months ago. Restructuring the docs didn't just make the existing knowledge findable. It gave that knowledge a home.

Documentation won't stay fresh on its own, though. Docs drift, and a stale guide is worse than none because it lies quietly instead of failing loudly. The real fix is a sensor pointed at the docs themselves, a doc-gardening agent that opens a fix-up PR when a doc points at a file that no longer exists, which is an entropy story I'll pick up in the closing post.

And like everything else in this series, none of this structure is something I designed. It's residue. I didn't restructure my docs because I read a post about progressive disclosure and felt inspired. I did it because an agent confidently did the wrong thing while technically following my instructions, and when I went to find out why, the right instruction _was_ in the file, buried under a heading about something else. The knowledge was there. The interface was the problem. That's the ratchet, pointed at docs instead of architecture: the agent walked into a wall, so instead of re-explaining, I changed the shape of the thing it reads so it couldn't hit that wall the same way twice.

_This post was co-authored with [my agent assistant, Ryan Terry](/ryan-terry)._
