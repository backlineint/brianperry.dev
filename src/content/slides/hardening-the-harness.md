---
title: "Hardening the Harness"
description: "Infrastructure that makes AI agents reliable contributors. Companion deck for the Decoupled Days 2026 talk."
date: 2026-08-07
event: "Decoupled Days 2026"
---

<!-- .slide: class="section center" -->

# Hardening the Harness

Infrastructure That Makes AI Agents Reliable Contributors

<span class="kicker">Brian Perry · Decoupled Days 2026</span>

Note:

- 60 min, intermediate. Six layers + framing + close. Appendix is Q&A backup.
- Open cold with the story on the next slide. Don't read the agenda yet.

---

<!-- .slide: class="center" -->

## A green PR that did everything wrong

Tests green. Lint clean. Feature built.

It also imported across two workspaces that should never touch.

Note:

- Real story: an agent's PR had the app importing from the extension.
- Obvious in review. The rule lived in my head. The agent had no way of knowing.

---

## The agent wasn't the problem

The codebase was. It ran on tribal knowledge an agent can't absorb by osmosis.

> Make the implicit **explicit**. Make the explicit **machine-checkable**.

<!-- .element: class="fragment" -->

Note:

- This is the whole talk in one line.
- Not a better prompt, not the next model. Infrastructure.

---

<!-- .slide: class="section" -->

## What's a "harness"?

Note:

- Quick definitional grounding so the rest has vocabulary. ~90 seconds.

---

## Agent = Model + Harness

The model does the thinking. The harness is everything else: prompts, tools, file system, rules, feedback loops.

The part **you** control: your codebase and the scaffolding around it. The _outer_ harness.

<!-- .element: class="fragment" -->

<span class="small muted">Vivek Trivedy, "The Anatomy of an Agent Harness"</span>

Note:

- Claude Code is a harness. Codex is a harness. Most of it you don't control.
- This talk is about the part you do: the repo.

---

## Two distinctions organize everything

<div class="grid2">
  <div class="card">
    <h3>Guides — feedforward</h3>
    <span class="lead">Steer before it acts.</span><br/>
    Conventions, rules, allowed imports.
  </div>
  <div class="card">
    <h3>Sensors — feedback</h3>
    <span class="lead">Catch after it acts.</span><br/>
    Tests, linters, screenshots.
  </div>
  <div class="card">
    <h3>Computational</h3>
    <span class="lead">Deterministic, cheap.</span><br/>
    Always right. Runs on every change.
  </div>
  <div class="card">
    <h3>Inferential</h3>
    <span class="lead">Model judgment.</span><br/>
    Slower, costlier. Catches what a regex can't.
  </div>
</div>

<span class="small muted">Birgitta Böckeler, "Harness engineering for coding agent users"</span>

Note:

- Every layer in this talk lands somewhere on this grid. Call it back each time.
- Right kind of control, right place.

---

<!-- .slide: class="center" -->

## The ratchet

Every mistake the agent makes becomes a new guide or sensor.

Every line in `AGENTS.md` traces back to a real failure.

**You don't download a harness. You accumulate one.**

<!-- .element: class="fragment" -->

<span class="small muted">Addy Osmani, "Agent harness engineering"</span>

Note:

- The connective tissue. The layers aren't a checklist, they're a system you steer.
- Böckeler's more formal name for it: the steering loop.

---

<!-- .slide: class="center" -->

## The one idea

The same properties that make a codebase good for **humans** make it legible for **agents**.

Clear boundaries · single sources of truth · explicit ownership · visible outcomes

Agents just expose every place you were running on tribal knowledge.

<!-- .element: class="fragment" -->

Note:

- The throughline. Repeat at the close.
- The investment you make for the agent is the one you'd been putting off for the humans.

---

## The six layers

1. Architecture that enforces itself
2. Documentation as a hierarchy
3. Cross-workspace contract ownership
4. Visual verification
5. Inferential controls
6. Observability the agent can read

<span class="muted small">Structure you can check → outcomes you can see → judgment only a model can make → behaviour you can query.</span>

Note:

- 1-3 formalize structure. 4 formalizes outcomes you can see. 5 is the inferential half of the grid — judgment a regex can't reach. 6 is the runtime sensor — behaviour you can only see while it runs.
- Each one: the failure that prompted it, the fix, a demo.

---

<!-- .slide: class="section" -->

## 1 · Architecture that enforces itself

Note:

- The rule lived in my head, so an agent crossed it. A doc is a description of intent; it doesn't stop anything.

---

## A document doesn't stop anything

You write "the app doesn't import from the extension" in a doc.

Three weeks later, something imports from the extension anyway.

The fix: turn the rule into a check that **fails the build**.

<!-- .element: class="fragment" -->

<span class="small muted">Architectural fitness functions — Ford, Parsons & Kua, _Building Evolutionary Architectures_</span>

Note:

- A human absorbs the architecture by osmosis. An agent has your files and whatever you told it.
- If a boundary isn't checkable, it isn't real.

---

## Two tools, twenty minutes

- **dependency-cruiser** — boundaries between workspaces. Five rules, one per workspace: nobody imports from anyone.
- **`check-structure.mjs`** — ownership _inside_ a workspace. ~11 rules: only 3 files touch the service-role key, UI can't reach the API layer, Mastra layering.
- Both run in `ci:verify`. A violation **fails the PR** on its own.

<span class="small muted">Grid: computational guide + computational sensor · architecture-fitness</span>

Note:

- Deterministic first: the always-wrong, cheap-to-check rules before anything heuristic. My doc literally says "Phase 1."
- Every rule is a scar — each one exists because something already went wrong. That's the ratchet.

---

## The error message is talking to the agent

```
- service-role-key-ownership: app/lib/feed.ts
  Only dedicated service-role Supabase owner modules
  may read service-role Supabase keys.
```

That sentence isn't for me. It's for whoever fixes it — increasingly, an agent reading it straight out of CI.

<!-- .element: class="fragment" -->

<span class="small muted">Böckeler: "a positive kind of prompt injection" — a sensor doing the work of a guide</span>

Note:

- The remediation text lands in the agent's context. It knows what broke and what the right shape is.
- Costs one extra string per check.

---

<!-- .slide: class="center" -->

<span class="demo-badge">Demo · Layer 1</span>

![GitHub Actions log: dependency-cruiser fails architecture:check on app/__tests__/extensionPopupAuth.test.ts importing from the extension. 1 violation, 203 dependencies cruised, build exits 1.](/slides/architecture-check-ci-failure.png)

One violation out of 203. A **test** in the app reached into the extension — the kind of thing review waves through.

Note:

- This is the real run from Post 2. Same rule that opened the talk.
- Fallback if live demo fails. Lead with the red X, then the caption.

---

<!-- .slide: class="section" -->

## 2 · Documentation as a hierarchy

Note:

- The other half of the harness: not the sensors that catch the agent after, the guides that steer it before.
- My root `AGENTS.md` had quietly become a junk drawer. A pile is a bad interface for an agent — it can't skim the way you do.

---

## A map, not a 1,000-page manual

- A monolithic `AGENTS.md` is bad for humans, **worse for agents** — they can't skim
- Cut it to a short table of contents that delegates to a scoped `docs/` tree
- One rule: **no duplication.** Project-wide at the root, workspace-specific in the workspace, nowhere twice

<span class="small muted">Grid: guide (computational + inferential) · progressive disclosure · agent legibility</span>

Note:

- An agent reads the whole file or misses context. Progressive disclosure beats one big blob.
- "What the agent can't see doesn't exist." Tribal knowledge has to land in the repo.

---

<!-- .slide: class="center" -->

<span class="demo-badge">Demo · Layer 2</span>

One junk-drawer file → a ~70-line index over a scoped tree:

```text
AGENTS.md                 # ~70-line table of contents
docs/                     # 9 project-wide guides
ai/  AGENTS.md → docs/    # workspace index → scoped docs (6 files)
app/ · extension/ · supabase/   # each: AGENTS.md → docs/
```

An agent in `ai/` loads the root index, opens `ai/AGENTS.md`, pulls `ai/docs/conventions.md` — and never reads a word about the extension.

<!-- .element: class="fragment" -->

Note:

- Progressive disclosure in action: the context fills with what the task touches, nothing else.
- The ratchet again — I didn't design this. An agent followed a buried instruction into a wall, so I changed the shape of what it reads.

---

<!-- .slide: class="section" -->

## 3 · Cross-workspace contract ownership

Note:

- The seam between workspaces: the parser produces a shape, the app renders it, a workflow persists it. Real, load-bearing, and for a while written down nowhere but my head.
- A change in `ai/` rippled two workspaces over and broke a consumer. Locally correct, green in its own workspace, broken in composition.

---

## The coupling lived nowhere

A change to the parser result in `ai/`. Locally correct, tests green.

It yanked one end of a rope tied to a file two workspaces away — and nothing connected them that anyone could see.

<span class="small muted">Grid: computational guide · agent legibility</span>

Note:

- A veteran carries the map in their head: touch the parser result, go fix the add-article route. It's written nowhere, so "everyone" is exactly one person. The agent has none of it.
- Cross-workspace coupling is the most invisible knowledge in the repo, and its absence does the most damage.

---

## A map that sorts, not a doc that fixes

Write each durable contract down: **owner + consumers**. That's the floor.

Its real job is to sort each seam by the **physics of the boundary** — which decides how hard you can enforce it.

<div class="grid2">
  <div class="card">
    <h3>Delete it</h3>
    <span class="lead">Collapse the seam.</span><br/>
    Both ends become one shared symbol. Drift is impossible.
  </div>
  <div class="card">
    <h3>Block it</h3>
    <span class="lead">Build-time.</span><br/>
    A shared symbol both derive from; a bad change fails to compile.
  </div>
  <div class="card">
    <h3>Detect it</h3>
    <span class="lead">Runtime.</span><br/>
    No shared symbol (SQL, HTTP): validate the actual bytes.
  </div>
  <div class="card">
    <h3>Discipline</h3>
    <span class="lead">Out of reach.</span><br/>
    A consumer you can't change: back to a rule you must remember.
  </div>
</div>
<!-- .element: class="fragment" -->

Note:

- The doc doesn't enforce. It tells you which tier a seam is, so you reach for prevention where you can and settle for detection only where you can't.
- Writing it down is the least you can do. The interesting question is what you do once you can see the seam.

---

## The strongest fix deletes the seam

The extension hand-copied the parser type — kept in sync by vigilance and an assertion that yelled on drift.

```ts
import type { ParserResult } from "../../../shared/articleContracts";
export type { ParserResult };
```

One symbol, not two. Drift isn't caught — there's nothing left to drift. I retired the sensor that policed the copy.

<!-- .element: class="fragment" -->

<span class="small muted">Grid: computational guide → build-time coupling · the ratchet</span>

Note:

- Editing the shared shape now fails every consumer's typecheck, immediately. I didn't add a check — I made both ends the same object.
- The cost, on purpose: the extension can't compile without the shared package. Three copies that can silently disagree → one source that loudly can't.
- The ceiling: the shipped extension already in someone's browser I can't reach. There, deletion fails and you're back to backward-compat as discipline.

---

<!-- .slide: class="center" -->

<span class="demo-badge">Demo · Layer 3</span>

`cross-workspace-contracts.test.ts` — the backstop for seams you can't delete. Three sensors, one file:

```text
safeParse  · fixtures against the shared schema (runtime)
SQL-text   · a TS constant must appear in a migration's CHECK
frozen     · every shipped extension payload still validates
```

A contract that drifts out of sync with its consumers fails the build.

<!-- .element: class="fragment" -->

Note:

- The three sensors map to the tiers: runtime validation for a seam you can't collapse, a grep-the-migration check where a Zod value and a Postgres column share no symbol, and append-only frozen payloads for the extension I can't reach.
- Real captures live in Post 4. Show the file, then the green run.

---

<!-- .slide: class="section" -->

## 4 · Visual verification

Note:

- Structure → outcomes. The first three make the agent write correct code; none of them tell it what the code looks like.
- The behaviour half of the harness — the category Böckeler and Fowler are honest about being hard. I've built it, but built it in exactly one place.

---

## Another green PR — this one looked wrong

Tests green. Lint clean. Architecture checks passed, docs filed, no contract drifted. Every signal I'd automated said ship it.

Then I ran the app: the new control sat half off the screen on mobile.

<!-- .element: class="fragment" -->

Every sensor I'd built was watching the **code**. Not one was watching the **app**.

<!-- .element: class="fragment" -->

<span class="small muted">Obvious in a second of looking, invisible to every assertion I owned</span>

Note:

- Deliberate rhyme with the opening story: a PR that passes everything and is still wrong. Layer 1 was a rule in my head; this is an outcome no rule can see.
- "The imports are legal" is a property of the source. "The button is visible" is a property of a pixel that doesn't exist until the app runs in a browser. That's why behaviour is the hard category.

---

## Give the agent eyes

- The cheapest move works: after the change, launch a browser, hit the routes that **changed**, capture what renders
- Diff-driven, not a fixed screen set — navigate to the _feature it just built_, at desktop **and** mobile viewports
- Auth routes: spin up the stack, sign in a seeded user, shoot the protected screens, tear the session back down
- **Report-only** — PNGs rendered inline in the agent's own reply. A mirror, not a judge.

<span class="small muted">Grid: computational sensor — capture, not judgment · the behaviour harness</span>

Note:

- The skill is `visual-verify`. It reads the branch diff, works out which surfaces are UI — app, marketing site, extension popup — starts only the dev servers it needs, and drives a real browser. No UI in the diff → it skips.
- You don't need the agent to _understand_ the screenshot for it to earn its place. You need it to exist, attached to the work, where I see it without pulling the branch.
- Report-only is deliberate: capture and judgment stay separate. That choice pays off at the close.

---

## The hard part isn't the clever part

Getting a browser to behave — auth, dev servers, headless Chrome — inside a cloud sandbox cost more than the verification it enabled.

Two moves out of the hole:

<!-- .element: class="fragment" -->

- Stop hand-driving Playwright — move capture onto **agent-browser**. The artifact is the point; the plumbing is just tax.
- Stop pretending it runs everywhere. In a cloud task or CI, the skill returns **SKIP** — a real limit, stated plainly and enforced in code.

<span class="small muted">The good version runs in exactly one place: a local dev session</span>

Note:

- I spent more time debugging the verification than writing it. For a tool whose whole job is confidence about agent output, that setup cost was backwards.
- Honesty beat: the loop is built, but it's local-only. Closing that last gap — a full authenticated stack in CI — is the genuinely hard work still ahead.

---

## One skill, two very different browsers

The `visual-verify` skill is **agent-agnostic** — it detects scope from the diff and hands back the same manifest whether Codex, Claude, or Cursor is driving.

Getting each agent to _hold a browser at all_, though, is per-agent plumbing that doesn't transfer:

<!-- .element: class="fragment" -->

<div class="grid2">
  <div class="card">
    <h3>Codex</h3>
    <span class="lead">A native in-app Browser.</span><br/>
    Opens the app, clicks through, watches. Interactive — and desktop-only (no CLI, no CI).
  </div>
  <div class="card">
    <h3>Claude</h3>
    <span class="lead">A <code>launch.json</code>.</span><br/>
    Names the dev servers; its own browser launches them and attaches.
  </div>
</div>
<!-- .element: class="fragment" -->

<span class="small muted">Same destination — a GUI plugin vs. a config file · the agnostic skill rides on agent-specific plumbing</span>

Note:

- The headline "each agent can use a browser" hides a real asymmetry: same skill on top, completely different roads to the app underneath.
- "Can it use a browser" is a statement about the surface it runs on as much as the model — Codex's Browser is desktop-only; Claude reaches the same app through a file that says how to start it.
- The plumbing didn't port between them even though the skill did — which is exactly why an agent-agnostic capture layer is worth having.

---

## How far operating actually gets me

Even once an agent can operate the app, my capture _cheats_ to get there — it looks up an article ID in the database to reach a screen fast.

Efficient for evidence. Not the same as driving the flow a user drives.

<!-- .element: class="fragment" -->

The next unlock is the boring one: real smoke tests with auth in CI. Storybook's already wired for the cheap shots I'm not taking yet.

<!-- .element: class="fragment" -->

<span class="small muted">Watching: Passmark — natural-language tests over real Playwright</span>

Note:

- Operating — logging in, filling the form, driving the actual feature — is where the agent confirms the thing _works_, not just that it painted something.
- The wall is the same one from the last slide: a full authenticated stack in a cloud runner. That's where the effort goes next. Storybook is the most leveraged move I'm not yet making.

---

<!-- .slide: class="center" -->

<span class="demo-badge">Demo · Layer 4</span>

`visual-verify` captures. `gh-post-visual-evidence` publishes.

<span class="placeholder">[ visual-verify output: desktop + mobile capture of a changed route, rendered inline ]</span>

One skill's job is to _capture_ evidence; a different skill's job is to _publish_ it. Neither may silently do the other's.

<!-- .element: class="fragment" -->

Note:

- Show a real visual-verify run — the PNGs render inline in the agent's reply. This is the payoff slide; lead with the picture.
- The publisher posts to a provenance-checked PR comment on a side branch — which commit it captured at, whether the tree was clean — and rejects stale evidence rather than quietly misleading a reviewer. Local-only, and only when I ask.
- Bridge to Layer 5: report-only capture now, a vision model grading against the spec next. That split is the whole next layer.

---

<!-- .slide: class="section" -->

## 5 · Inferential controls

Note:

- The grid's other half. Layers 1–4 were almost all computational — deterministic checks the CPU runs in milliseconds. This is the sensor category that needs a model to weigh in.
- Sibling to visual verification: both are feedback sensors on outcomes. One reads the code, one reads the rendered app; neither is a regex.

---

## A third green PR — this one was pointless

Tests green. Lint clean. Architecture and contracts intact. Buried inside: a new test that asserted nothing the suite didn't already cover.

Counted toward coverage. Completely redundant.

<!-- .element: class="fragment" -->

"This test is noise" isn't a property you can grep for — it's a judgment about what the _other_ tests already mean.

<!-- .element: class="fragment" -->

<span class="small muted">Grid: the inferential column · a linter knows the import is illegal; only a model knows the abstraction is wrong</span>

Note:

- The third rhyme: Layer 1 was a PR that imported wrong, Layer 4 one that looked wrong, this one is pointless. Same setup, a failure one more notch from anything deterministic.
- Computational catches structure. Inferential catches meaning — the wrong abstraction, the redundant test, the refactor that quietly missed the point. Böckeler: expensive and probabilistic, "not on every commit."

---

## The one rule: the judge is not the author

The moment your reviewer is a model, you pick _which_ model, in what context, sees the work. The labs keep landing on the same answer: not the one that wrote it.

An agent that just spent twenty minutes building a feature is its worst reviewer — attached to the approach, already convinced it's done.

<!-- .element: class="fragment" -->

So the review runs **isolated**: a fresh context, pointed only at the diff, no memory of the authoring. Same model, maybe — clean slate.

<!-- .element: class="fragment" -->

<span class="small muted">Grid: inferential sensor · Anthropic: isolated LLM-as-judge + the generator/evaluator split · Addy Osmani</span>

Note:

- Don't let an agent grade its own homework. It remembers why every awkward line is there and will rationalize each one.
- Isolation is the whole game — a reviewer with no attachment to the approach is most of what "a second opinion" ever meant.

---

## Code review as a skill you can call

Four questions and a careful definition of "all the work" — committed, staged, unstaged, and the untracked files git won't show unless you ask.

```text
Is the intent clear?  ·  Any concerns with the implementation?
Patterns worth documenting?  ·  Is there sufficient test coverage?
```

The two that _aren't_ about correctness — concerns? and coverage? — are what catch the wrong abstraction and the do-nothing test.

<!-- .element: class="fragment" -->

Wired into the root `AGENTS.md`, so it's the default for every task — mine, Codex's, Claude's — **local _and_ cloud**.

<!-- .element: class="fragment" -->

<span class="small muted">Grid: inferential sensor · review as a callable tool, not a mood</span>

Note:

- The value isn't a clever prompt; it's that review is now a thing that always happens instead of a thing I remember to ask for when I'm feeling diligent.
- Same scope definition visual-verify reuses, on purpose — the two reviews always read the same change set.
- The reversal from Layer 4 worth calling out: this one runs local _and_ cloud. Judgment doesn't need a browser, so it never hits the sandbox wall.

---

## The same rule, pointed at pixels

`visual-verify` is **report-only** — it captures and refuses to grade. The same author/judge split in different clothes: whoever made the artifact is the wrong party to rule on it.

- The judge is a separate **vision-model** pass — _does this match the spec?_ — a real second opinion, because it never ran the browser
- **Capture → judge → publish**: three skills, three jobs; none silently does another's
      <!-- .element: class="fragment" -->

<span class="small muted">The ceiling: run it late, not on every commit · calibrate against humans — you don't get to fully outsource the grading</span>

Note:

- Report-only wasn't a limitation I apologized for in Layer 4 — it was the down payment on judging separately.
- Honesty beat, same shape as every layer's ceiling: the judge is a model too. It waves real problems through and invents fake ones. These skills raise the floor; they don't clear me out of the room.

---

<!-- .slide: class="center" -->

<span class="demo-badge">Demo · Layer 5</span>

<span class="placeholder">[ $code-review in an isolated subagent flagging the redundant test — "coverage?" catching what green couldn't ]</span>

Spawned fresh, reads the diff cold, reports back. The author has to address every finding before it's allowed to finish.

<!-- .element: class="fragment" -->

Note:

- Show a real code-review run finding a genuine issue — ideally the coverage / redundant-test catch, since it pays off the setup slide.
- The agent doesn't get to finish by declaring itself finished. Author and judge, kept apart by construction.

---

<!-- .slide: class="section" -->

## 6 · Observability the agent can read

Note:

- Structure → outcomes → judgment → runtime. Layers 1–5 read the code, the screen, and the diff. None of them can see how the app _behaves_ once it's actually running.
- The runtime sensor. Used to be the least-built, most-aspirational layer — now it's the one where I finally have something real to show.

---

## None of it can see the app running

The first five layers prove the code is correct, _looks_ right, and reads as _good_.

None of them can see what it **does** when a real request hits it — what the logs say, where the time goes, what it cost.

<!-- .element: class="fragment" -->

> From the agent's point of view, anything it can't access while running **doesn't exist**.

<!-- .element: class="fragment" -->

<span class="small muted">OpenAI, "Harness engineering" · agent legibility, pointed at runtime</span>

Note:

- Runtime behaviour only exists while the app executes, then vanishes. Unless you capture it somewhere the agent can reach, it never enters the agent's world at all.
- Grid: this is a _sensor_, and a mostly _computational_ one — a row is a row, a token count is a token count. The hard part isn't judgment, it's plumbing: capture it, store it durably, make it legible.

---

## I tuned a ranking system blind for weeks

More Later sorts saved articles into relevance lanes. For a while it was quietly bad at it — and every fix was a vibe.

Tweak a weight, re-run, squint at the output. Better? Genuinely couldn't tell.

<!-- .element: class="fragment" -->

The agent and I were two confident parties agreeing to fly blind together.

<!-- .element: class="fragment" -->

<span class="small muted">The failure that prompted the layer — same origin story as every other, aimed at runtime</span>

Note:

- I was asking an agent to fix a system while starving it of any data about how the system behaved. Of course we were guessing — guessing was the only thing on the menu.
- The rhyme with the other layers: a specific failure I couldn't see, so I built the sensor that makes it visible.

---

## Instrument the run — then let the agent read it

Every recommendations run writes a **structured row**: score distribution, lane counts before and after selection, thresholds, eligible vs. selected.

Then connect the **Supabase MCP** — and the agent queries the table directly.

<!-- .element: class="fragment" -->

Not me pasting numbers into a prompt. The agent runs the slices I'd never think to run.

<!-- .element: class="fragment" -->

<span class="small muted">Grid: computational sensor · agent legibility · legible because a connector already reaches it</span>

Note:

- The metrics existing wasn't the unlock. The metrics being _reachable by the agent through a connector it already speaks_ was — that's the whole layer in one instance.
- When I summarize the data I pre-filter it through the same assumptions that got the ranking lost. When the agent reads the rows, it sees what I'd have skipped. Vibe in, diagnosis out.

---

## The other runtime question: cost

An agent can refactor a workflow, pass every check, and quietly **double the model calls per article**. You find out on the bill, weeks later.

- `article_api_usage` — a row per model call: tokens, `estimated_cost_usd`, duration. App-facing, RLS-scoped, queryable
- Mastra → **PostHog** for the aggregate trace view — payload fields stripped before ingest
      <!-- .element: class="fragment" -->

"Did my last change make tagging more expensive?" becomes a **query**, not a surprise.

<!-- .element: class="fragment" -->

<span class="small muted">Grid: computational sensor · structured logging is the floor — a human greps, an agent queries</span>

Note:

- Two altitudes: a durable per-article Supabase signal the agent reaches the same way it reaches the ranking metrics, and aggregate cost/latency traces in PostHog for me.
- The honest ceiling: I can make _designed_ signals legible — a table I chose to write. I can't yet hand the agent the raw log/trace firehose in its sandbox to fish for a failure I didn't anticipate. That's the LogQL/PromQL-over-an-ephemeral-stack part OpenAI has and I don't.

---

<!-- .slide: class="center" -->

<span class="demo-badge">Demo · Layer 6</span>

<span class="placeholder">[ agent querying recommendation_run_metrics via the Supabase MCP → a diagnosis + sequenced tuning plan ]</span>

"Anecdotally I'm seeing scores in the 40s and an empty bottom tier." The agent checks the vibe against thousands of real rows.

<!-- .element: class="fragment" -->

Note:

- Show the real transcript from Post 7: a squishy human impression handed to something that can verify it against the data, coming back with a plan grounded in the numbers rather than my gut.
- Honesty beat, same as every layer: this is a sensor the agent _can_ read, not yet one it reads _by default_. The cloud agents don't consult it on their own — the query path still runs through me.

---

<!-- .slide: class="section" -->

## A system you steer

Note:

- The close. Pay off the ratchet.

---

## Not a checklist. A practice.

- Recurring failure → tighten a control, don't re-prompt
    <!-- .element: class="fragment" -->
- Drift is inevitable: agents replicate whatever patterns exist, good or bad
    <!-- .element: class="fragment" -->
- Cleanup needs to run on a regular cadence, not just when someone remembers
  <!-- .element: class="fragment" -->
- Tip: agents are great at writing the linters that constrain agents
  <!-- .element: class="fragment" -->

Note:

- Recurring failure → tighten a control, not the prompt. Böckeler's steering loop.
- Entropy sets in the moment you stop. The next slide is how you pay for it.

---

## Garbage Collection to Fight Drift

Narrow audits in `tools/garbage-collection/` catch drift on a cadence — screen persistence, doc shape sync, the stuff that rots quietly.

They run on a schedule. Not when someone remembers to look.

<!-- .element: class="fragment" -->

<span class="small muted">Grid: computational sensor · OpenAI's "garbage collection"</span>

Note:

- Entropy sets in the moment you stop. This is how you pay for it.
- On a legacy codebase you'd lean on this hardest — surface the scale of the drift before it ever blocks a build.
- The screen-persistence audit already made the trip — it runs blocking inside `architecture:check` now. The doc-shape-sync one is still advisory; that's the next slide.

---

## A control that earns its teeth

A brand-new check hasn't earned the right to fail your build. So it starts as an **adviser** and graduates:

```js
if (!failOnFindings) {
    console.log("Advisory mode: findings do not fail this run.");
    process.exit(0);
}
process.exit(1);
```

Advisory → warn in CI → **blocking**, only once the false-positive rate earns it.

<!-- .element: class="fragment" -->

<span class="small muted">Grid: computational sensor · the ratchet made literal</span>

Note:

- The promotion conditions are written down: a clear owner, the findings understood, the false-positive rate low enough to trust in CI.
- This is the cleanest ratchet demonstration in the repo — a control that describes _how controls should be added_: cautiously, with evidence, earning enforcement instead of assuming it.
- The doc-shape-sync audit is still advisory, still earning trust. Screen persistence already graduated.

---

<!-- .slide: class="center" -->

## Infrastructure for humans _is_ infrastructure for agents

Same investment. Pays in both directions.

<!-- .element: class="fragment" -->

Note:

- Land the throughline one more time. This is the sentence people should leave with.

---

<!-- .slide: class="center" -->

## Thank you!

Brian Perry · brian@actual.ai · [brianperry.dev](https://www.brianperry.dev)

Note:

- Point to the blog series for the deep-dives and the copy-pasteable checklist.
- Open for questions. Appendix slides follow for the likely ones.

---

## References

- OpenAI — _Harness engineering: leveraging Codex in an agent-first world_
- Martin Fowler / Birgitta Böckeler — _Harness engineering for coding agent users_
- Phil Morton — _The anatomy of an AI agent_
- Addy Osmani — _Agent harness engineering_ · _Long-running agents_
- Anthropic — _Effective harnesses for long-running agents_ · _Demystifying evals for AI agents_
- Vivek Trivedy — _The Anatomy of an Agent Harness_

Note:

- Keep this up if someone asks "where do I read more."
