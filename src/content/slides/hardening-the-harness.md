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
- 60 min, intermediate. Four layers + framing + close. Appendix is Q&A backup.
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

The part **you** control: your codebase and the scaffolding around it. The *outer* harness.
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

## The four layers

1. Architecture that enforces itself
2. Documentation as a hierarchy
3. Cross-workspace contract ownership
4. Visual verification

<span class="muted small">Structure you can check → outcomes you can see.</span>

Note:
- 1-3 formalize structure. 4 formalizes outcomes.
- Each one: the failure that prompted it, the fix, a demo.

---

<!-- .slide: class="section" -->

## 1 · Architecture that enforces itself

Note:
- Fill demo asset from Post 2.

---

## From documented intentions to executable checks

- **dependency-cruiser** decides which workspace may import which
- **structural rules** enforce ownership: one file touches the service-role key, UI can't reach the API layer
- Gated in CI. A violation **fails the PR**. No reviewer judgment, no remembering the rule.

Deterministic first: ship the always-wrong, cheap-to-check rules before anything heuristic.
<!-- .element: class="fragment" -->

<span class="small muted">Grid: computational guide + computational sensor · architecture-fitness</span>

Note:
- OpenAI's layered architecture enforced by custom linters is the same move at scale.
- Lint error messages can inject remediation text into the agent's context.

---

<!-- .slide: class="center" -->

<span class="demo-badge">Demo · Layer 1</span>

Open a PR that crosses a boundary. Watch CI fail with a remediation message.

<span class="placeholder">[ screenshot / live: capture from Post 2 ]</span>

Note:
- Have the failing CI output ready as a fallback screenshot in case live fails.

---

<!-- .slide: class="section" -->

## 2 · Documentation as a hierarchy

Note:
- Fill from Post 3.

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

The short TOC + the `docs/` tree. Before/after the monolith.

<span class="placeholder">[ show the tree: capture from Post 3 ]</span>

Note:
- Optional: show an agent loading only the workspace-scoped doc for a scoped task.

---

<!-- .slide: class="section" -->

## 3 · Cross-workspace contract ownership

Note:
- Fill from Post 4.

---

## Make the ripple effects visible at PR time

- A shared contract changes and it's unclear who owns it or who breaks
- Write each durable contract down: **owner + consumers**
- Rule: changing a contract updates every consumer's docs in the **same PR**
- A check turns that rule into a guardrail

<span class="small muted">Grid: inferential guide → computational sensor · architecture-fitness</span>

Note:
- Coupling that lived in people's heads, written where an agent can act on it.
- Surfaces at PR time instead of as a production bug three weeks later.

---

<!-- .slide: class="center" -->

<span class="demo-badge">Demo · Layer 3</span>

The owner/consumer table + the executable contract test.

<span class="placeholder">[ show contracts doc + test: capture from Post 4 ]</span>

---

<!-- .slide: class="section" -->

## 4 · Visual verification

Note:
- Fill from Post 5. This is the build-before-show layer.

---

## Give the agent eyes

- Everything so far makes the agent write **correct** code
- None of it tells the agent what the thing **looks like**
- Attach Playwright **screenshots** and **screen recordings** to agent PRs
- "Tests pass" → "I can see the button is there and the layout isn't broken"

<span class="small muted">Grid: computational + inferential sensor · the behaviour harness</span>

Note:
- Structure vs outcomes: the first three formalize structure, this formalizes outcomes.
- Eventual goal: feed the visual output to a vision model so the agent self-reviews.

---

<!-- .slide: class="center" -->

<span class="demo-badge">Demo · Layer 4</span>

Before/after recording on a UI-change PR.

<span class="placeholder">[ recording: capture from Post 5 — the one layer I build before I can show ]</span>

Note:
- Strongest visual in the deck. Lead with the "after," then reveal the "before."

---

<!-- .slide: class="section" -->

## A system you steer

Note:
- The close. Pay off the ratchet.

---

## Not a checklist. A practice.

- Recurring failure → tighten a control, don't re-prompt
- Drift is inevitable: agents replicate whatever patterns exist, good or bad
- So cleanup runs on a **cadence**, whether or not anyone remembers
- Agents can write the linters that constrain agents

Note:
- Entropy / garbage collection. The advisory→blocking promotion policy is the ratchet made literal.
- More detail in the appendix if it comes up.

---

<!-- .slide: class="center" -->

## Infrastructure for humans *is* infrastructure for agents

Same investment. Pays in both directions.

Steal the harness checklist. →
<!-- .element: class="fragment" -->

Note:
- Land the throughline one more time. This is the sentence people should leave with.

---

<!-- .slide: class="center" -->

## Thank you

Brian Perry · brian@actual.ai · brianperry.dev

The series + harness checklist: *[link]*

Note:
- Point to the blog series for the deep-dives and the copy-pasteable checklist.
- Open for questions. Appendix slides follow for the likely ones.

---

<!-- .slide: class="section" -->

## Appendix · Q&A backup

- Inferential controls: review agents & LLM-as-judge
- Observability the agent can read
- Entropy & garbage collection
- References

Note:
- Don't present these by default. Jump here on the matching question.

---

## Appendix — Inferential controls

- Computational checks catch **structure**. Only a model knows the **abstraction** is wrong or a test is redundant
- A callable `code-review` skill: systematic review as a tool, not a thing someone remembers
- A cloud-agent review flow: a review subagent runs against the finished branch before finalizing
- **Don't let an agent grade its own homework** — separate generator from evaluator

<span class="small muted">Anthropic & Cursor: the planner/generator/evaluator split</span>

Note:
- This is Post 6. Inferential half of the grid.

---

## Appendix — Observability the agent can read

- The first four layers prove the code is correct and *looks* right. None show how it **behaves at runtime**
- "What the agent can't see doesn't exist" — applied to logs, metrics, traces
- Structured logging is the floor: logs a human greps vs. logs an agent can parse
- Direction: make recent logs/metrics queryable by the agent in its sandbox

<span class="small muted">OpenAI: LogQL/PromQL over an ephemeral per-worktree stack</span>

Note:
- This is Post 7. The least-built, most aspirational layer. Be honest about that.

---

## Appendix — Entropy & garbage collection

- Agents replicate existing patterns, including the bad ones. Drift compounds
- Narrow audits run on a cadence and open fix-up PRs
- **Advisory → blocking promotion policy**: a control earns its way from suggestion to enforcement
- That promotion policy is the ratchet made literal

<span class="small muted">OpenAI's "garbage collection" · Fowler's continuous drift sensors</span>

Note:
- The entropy beat from Post 8 / B3.

---

## References

- OpenAI — *Harness engineering: leveraging Codex in an agent-first world*
- Martin Fowler / Birgitta Böckeler — *Harness engineering for coding agent users*
- Phil Morton — *The anatomy of an AI agent*
- Addy Osmani — *Agent harness engineering* · *Long-running agents*
- Anthropic — *Effective harnesses for long-running agents*
- Vivek Trivedy — *The Anatomy of an Agent Harness*

Note:
- Keep this up if someone asks "where do I read more."
