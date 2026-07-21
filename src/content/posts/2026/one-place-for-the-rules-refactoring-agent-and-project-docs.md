---
title: "One Place for the Rules: Refactoring Our Agent and Project Docs"
description: We moved all of our rules and project documentation into a single, consistent layout. Here's what we did and why.
author: Brian
date: 2026-03-07
---

We just finished a refactor that moved all of our "rules" and project documentation into a single, consistent layout. Here's what we did and why.

## The problem

We had guidance for both humans and AI agents scattered in several places:

- **Root `AGENTS.md`** had grown into a long, monolithic file (hundreds of lines) mixing navigation, styling, package management, backlog workflow, Cursor rules, and more.
- **`.cursor/rules/`** held duplicate or overlapping content in `.mdc` files (package-management, navigation, infinite-scroll, backlog guidelines, etc.).
- **`backlog/docs/`** held feature docs (article archiving, collection archiving, duplicate prevention) that were really app-level behavior, not "backlog" per se.

So we had three different homes for "the rules," and no clear rule for *where to put new ones*. That made it easy to forget to update one place when another changed, and it wasn't obvious where to add documentation when finishing a task.

## What we wanted

We wanted:

1. **One source of truth** — Rules and patterns live in normal markdown under `docs/` (and workspace `docs/`), not in a separate system like `.cursor/rules` or `backlog/docs`.
2. **A short index, not a long handbook** — Root `AGENTS.md` should be a table of contents that points to those docs, not the place where everything is inlined.
3. **Clear ownership** — Project-wide stuff in root `docs/`; app-specific stuff in `app/docs/`; AI-specific in `ai/docs/`. New docs get created in the appropriate place, not in `backlog/docs/`.
4. **Tool-agnostic wording** — Guidelines framed as "rules" or "pattern docs," not "Cursor rules," so they're useful regardless of which editor or agent you use.

## What we did

### 1. Shrank root AGENTS.md to a TOC

We replaced the big `AGENTS.md` with a short index (~50 lines) that:

- Lists project-wide topics (package management, backlog, rules creation, rule-porting policy, workspace pattern) with links into `docs/`.
- Points to workspace `AGENTS.md` and `docs/` for app, ai, and extension.
- Describes "where things live" (tasks, decisions, docs) and a quick reference.

All the detailed content now lives in `docs/*.md` and `app/docs/*.md` (and `ai/docs/` where relevant). If you need the full rule, you follow the link.

### 2. Moved Cursor rules into docs

We deleted the old `.cursor/rules/*.mdc` (and one `.md`) files and moved their content into:

- **Root `docs/`** — e.g. `package-management.md`, `rules-creation.md`, `rule-porting-policy.md`.
- **`app/docs/`** — e.g. `navigation.md`, `nativewind-styling.md`, `infinite-scroll.md`, `article-archiving.md`.

We left a short `README.md` in `.cursor/rules/` that points to `docs/` and `app/docs/` so anyone opening that folder sees where things went. The canonical source is now the markdown in `docs/`, not the `.mdc` files.

We also renamed **cursor-rules-creation** to **rules-creation** and rewrote it as "how to add or update rules and pattern docs" in general, not Cursor-specific.

### 3. Retired backlog/docs and put feature docs in app/docs

We had three files in `backlog/docs/`:

- `article-archiving.md`
- `collection-archiving.md`
- `duplicate-prevention.md`

Those all describe app/domain behavior (Expo app + backend), so we moved them into **`app/docs/`**. We merged the full article-archiving content into the existing `app/docs/article-archiving.md` and added `collection-archiving.md` and `duplicate-prevention.md` there. We deleted the originals and added a `backlog/docs/README.md` that explains the move and points to `docs/` and `app/docs/`.

We then updated **all** instructions (including `docs/backlog.md` and the rule-porting policy) so that:

- **New documentation** is created in the **appropriate** place: root `docs/` for project-wide topics, or the right workspace `docs/` (e.g. `app/docs/`, `ai/docs/`) for package-specific ones.
- **Nobody** is told to create or update docs under `backlog/docs/` anymore.

So "where do I document this?" has a single, clear answer: the top-level or workspace `docs/` that matches the scope of the change.

### 4. Formalized the workspace pattern

We already had the idea of "root AGENTS.md + docs/" and "per-package AGENTS.md + docs/." We made that explicit:

- Root **AGENTS.md** lists which workspaces have their own **AGENTS.md** and **docs/** (app, ai, extension).
- **docs/workspace-agent-docs.md** describes when to add workspace-level guidelines and how they relate to the root.
- Workspace **AGENTS.md** files stay short: they point to root for global topics and list only that package's docs.

So the hierarchy is: one index at the root, one index per workspace that needs it, and the actual content in the corresponding `docs/` directories.

### 5. Updated every reference we could find

We changed:

- **docs/backlog.md** — Source of truth for "project documentation" is now `docs/` and workspace `docs/`. Added a "Where to add new documentation" section. Workflow and Definition of Done say "docs/ or the appropriate workspace docs/" instead of "backlog/docs."
- **docs/rule-porting-policy.md** — New/updated rules go into `docs/` or the right workspace `docs/` and are linked from the right AGENTS.md; no "port from backlog/docs" or "put in .cursor/rules."
- **AGENTS.md** — "Where things live" and quick reference no longer mention `backlog/docs` or `.cursor/rules` as doc homes; they point to `docs/` and workspace `docs/`.
- **.github/copilot-instructions.md** — Same idea: docs live in `docs/` and workspace `docs/`; workflow and DoD wording updated accordingly.
- **app/AGENTS.md** — Added rows for the new app docs (collection-archiving, duplicate-prevention) and kept article-archiving.

We didn't rewrite historical task files in `backlog/archive/`; those still mention the old paths as a record of what was done at the time.

## What the layout looks like now

- **Root:** `AGENTS.md` (short TOC) + `docs/` (backlog, package-management, rules-creation, rule-porting-policy, workspace-agent-docs).
- **App:** `app/AGENTS.md` (short TOC) + `app/docs/` (navigation, nativewind-styling, code-review, infinite-scroll, article-archiving, collection-archiving, duplicate-prevention, conventions).
- **AI:** `ai/AGENTS.md` + `ai/docs/` (e.g. conventions).
- **Entrypoint:** `CLAUDE.md` just says "See AGENTS.md for agent instructions."

Tasks and decisions stay in `backlog/tasks/`, `backlog/drafts/`, `backlog/decisions/`. The only "docs" locations we use for rules and patterns are **`docs/`** and **workspace `docs/`**.

## Why it helps

- **Single source of truth** — You edit one file (e.g. `app/docs/article-archiving.md`) and that's the rule. No syncing from backlog/docs or .cursor/rules.
- **Easier to find** — If it's about the app, it's under `app/docs/`. If it's about the whole project, it's under `docs/`. AGENTS.md tells you which workspace has its own docs.
- **Clear instructions** — Backlog and rule-porting both say: create docs in the appropriate top-level or workspace `docs/`, and link from the relevant AGENTS.md.
- **Tool-agnostic** — The content is "rules" and "pattern docs" in markdown; useful for any agent or human, not tied to one editor.

If you're doing a similar cleanup, the main idea is: pick one place for "the rules" (we chose `docs/` and workspace `docs/`), turn your main agent doc into a short index that links there, and update every instruction that currently sends people somewhere else. Then you can retire the old locations with a README that points to the new one.
