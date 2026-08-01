---
title: "Contracts That Know Who Breaks Them"
description: A contract between workspaces is real, load-bearing, and often written down nowhere but my head. Writing those seams down is the floor; the stronger move is deleting them so there's nothing left to break.
author: Brian
date: 2026-08-01
---

The [last post](/posts/2026/documentation-as-a-hierarchy) was about giving knowledge a home the agent can actually find: a table of contents up top, a scoped `docs/` tree underneath, one fact in one place. That made the knowledge that was already written down findable. This post is about a kind of knowledge that tends not to get written down at all, because it doesn't live *in* any one workspace. It lives in the seams between them.

I'm talking about contracts. The shape one part of the system hands to another. The parser produces a result, and the app renders it, and a workflow persists it, and none of those three files sit next to each other or even in the same workspace. The contract between them is real, and load-bearing, and for a while it existed nowhere but my head.

The first draft of this post stopped there: write the seam down so it's visible, add a test so it stays true, done. Then I went and actually did the work across a handful of these contracts, and it turned out documenting was the beginning, not the end. Sometimes the best thing you can do to a seam isn't write it down. It's delete it, so there's nothing left to write down.

### A change with no clear blast radius

Here's the failure that started this one. Something touched the parser's result shape in the `ai/` workspace. Small change, locally correct, tests green in that workspace. What it didn't do was update the code two workspaces over that reads that shape, because nothing connected the two in a way anyone (or anything) could see. It surfaced later, the way these always do, as a thing that was fine in isolation and broken in composition.

A contributor who'd been on the project a while wouldn't have made that mistake. Not because they're smarter, but because they carry the map around in their head: touch the parser result and you have to go update the add-article route, everybody knows that. Except it isn't written anywhere, so "everybody" is exactly one person, and an agent has none of it. It sees the file in front of it, makes the locally correct change, and has no way to know it just yanked one end of a rope tied to something in the next room.

This is the docs problem from the last post, but nastier. A monolithic `AGENTS.md` at least *had* the knowledge, badly filed. Cross-workspace coupling usually isn't written down at all. It's the most invisible knowledge in the repo, and it's the knowledge whose absence does the most damage.

Hold onto that specific failure. The obvious fix is a test that exercises the composition, an end-to-end run that drives the parser output all the way through to the add-article route and fails the moment the two stop agreeing. That's a real fix, and for some of the seams in this post it's the only one on offer. But I'm going to come back to *this* failure at the end and show you something stronger than a test catching it: a change that made the mistake impossible to make in the first place.

### Write the seam down, and find out which seam it is

The fix starts embarrassingly simply: write the seams down. In [More Later](https://www.morelater.app) that's a single file, `docs/cross-workspace-contracts.md`, one entry per durable contract: what it is, which workspace *owns* it, and which workspaces *consume* it.

```markdown
## Shared contract boundaries

### Parser result
- **Canonical source:** `shared/articleContracts.ts` (`parserResultSchema` / `ParserResult`)
- **App dependency:** `app/lib/types.ts` re-exports the shared schema for app-side validation
- **AI dependency:** AI consumes related parsed shapes in workflows and tools
- **Extension dependency:** extension imports the shared `ParserResult` type — no local copy
- **Database dependency:** `supabase/` stores parsed content in `articles.parsed_content`

### Add-article route
- **Canonical request contract:** `shared/articleContracts.ts` (`addArticleRequestSchema`)
- **Primary owner:** `app/` owns the route handler, response shape, auth, and error codes
- **Consumers:** `extension/` builds the request body from the shared type
- **Related systems:** `ai/` workflows in the background; `supabase/` articles table

### Workflow payloads
- **Primary owner:** `ai/`
- **Consumers:** `app/`
- **Persistence:** `supabase/`

### Archived lifecycle
- **Primary owner:** `supabase/` for actual enforcement
- **Consumers:** `app/`
```

The contracts worth an entry aren't every function signature in the repo. They're the handful of durable ones where a change ripples across a boundary: the parser result shape, the add-article API route, the workflow input/output schemas, the rules around the archived-article lifecycle. The test is whether getting it wrong breaks something you can't see from where you're standing.

But the file doesn't enforce anything. Its job is to sort. For each entry it tells you what *kind* of boundary you're looking at, and the kind of boundary decides how strongly you get to enforce it. At the strong end, some seams you can delete outright, collapse both ends into one object so there's nothing to keep in sync. In the middle, some you can't delete but can wire together at build time, so a bad change fails to compile. At the weak end, some you can only watch at runtime, because the two ends don't share a symbol to hang a check on. And past that, a couple that fall off the ladder entirely. The map is one file. The guardrails it points you toward are many, and they don't all look alike.

### Not every seam is the same seam

Sort the entries by how they couple and three tiers fall out, strong end first.

**Tier one: same language, literal copy.** The app and the browser extension are both TypeScript, and the extension needed the parser result type. So it kept its own copy, hand-transcribed, held in sync by vigilance and a type-level assertion that yelled when the two drifted. That copy was pure liability. It existed for no reason except that nobody had wired the two workspaces together. The fix isn't a better sensor, it's *removing the seam*: the extension imports the type from the shared source instead of re-declaring it.

```ts
// ParserResult is the canonical article ingestion contract owned in shared/.
// Imported as a type so no zod runtime is pulled into the extension bundle,
// and re-exported so popup modules keep importing it from `./api`.
import type { ParserResult } from "../../../shared/articleContracts";

export type { ParserResult };
```

Now there's one symbol, not two, so there's nothing to keep in sync and nothing to drift. I deleted the assertion that used to police the copy, not because it stopped working but because the seam it watched no longer existed. You don't need a smoke detector in a room you demolished.

Before, an agent editing the shared shape saw the file in front of it, made the locally correct change, and had no way to know a second copy existed in another workspace. The moment both ends are one shared import, editing that shared file makes *every* consumer fail typecheck, immediately, at build time. I didn't add a check. I made the rope visible by making both of its ends the same object.

The extension now can't compile without the shared package, and a careless change to the shared shape breaks three workspaces at once instead of one. That's the point, not a side effect: I traded three copies that can silently disagree for one source that loudly can't. When you *can't* take on that coupling, or the boundary won't let you, you're back to sensors.

**Tier two: same language, different contract.** The `ai/` workspace also consumes the parser result, but it doesn't want the bare shape. It wraps it in a different envelope for its own purposes (`{ parsedData, url }`). This one can't collapse all the way, there's a genuinely distinct shape at the boundary. But it doesn't need a hand-copy of the *inner* part either. It derives the inner shape from the shared source and keeps only its own envelope.

```ts
import { z } from 'zod';
import { parserResultSchema as sharedParserResultSchema } from '@shared/articleContracts';

// The parser tool/workflow envelope: the canonical article ingestion contract
// (shared/articleContracts.ts) plus the source URL. The inner parsedData is
// derived from the shared schema so ai/ stays in lockstep with the app and
// extension instead of maintaining a divergent copy of the parsed-article shape.
export const parserResultSchema = z.object({
  parsedData: sharedParserResultSchema,
  url: z.string(),
});
```

Remember the failure I told you to hold onto? This is the room the rope was tied to. The `ai/` change that broke a consumer two workspaces over broke it because `ai/` had its own private idea of the parser result, and the two ideas were free to disagree. They disagreed on exactly one field: `ai/` had `primaryImage` as `.optional().nullable()` while the shared contract required the key (`.nullable()`). The parser always sets that field to a string anyway (an `og:image` URL, or an empty string when there's none), so requiring it just matched what the code already did, and closed a latent gap where an `ai/` output could pass its own checks and then fail the app's render schema. Once `ai/` derives its inner shape from the shared source, the two ideas are one idea, and one idea can't disagree with itself.

**Tier three: different language, or different process.** The app talks to Supabase over SQL. It talks to `ai/` over HTTP. There's no shared symbol between a Zod schema and a Postgres column, and none across an HTTP boundary either. You *cannot* collapse these, because collapsing means making both ends the same object, and here the two ends don't live in the same universe. So these are the seams you keep, and for the ones you keep you reach for a matched sensor: a runtime round-trip that validates the actual bytes crossing the boundary, or a check that asserts a TypeScript constant literally appears in the text of a migration's SQL.

That's the whole function of the map. Not to enforce, but to sort, so you reach for deletion where the boundary allows it and settle for detection only where it doesn't.

### From checklist to guardrail

For the seams you can't delete, the map still has to stay true, and a table is exactly the kind of thing that quietly goes stale. So there's a rule: changing a contract means updating the owning workspace's doc *and* every consuming workspace's doc, in the same PR. It's a line in a change checklist (`change-checklists.md`).

But be honest about what a checklist is. It's a note to your future self or your agent that says *don't forget this part*, and it works right up until the moment someone (human or model) is moving fast and doesn't read it. A guide that depends on discipline is a guide with a hole in it. So the checklist item has a computational backstop: an executable test, `tools/contracts/cross-workspace-contracts.test.ts` (it runs via `test:contracts`, gated in `ci:verify` like everything else). A change that drifts a contract out of sync with its consumers fails the build instead of sailing through review.

```ts
// tools/contracts/cross-workspace-contracts.test.ts
// (the shared-module loader is elided — it dynamically imports the
// canonical schemas from app/, shared/, and extension/ so every check
// below runs against the real thing, never a copy)

// Sensor one — runtime safeParse: real fixtures validated against the
// shared schema, the tier-three move for a seam you can't collapse.
test("persisted article parsed_content fixtures remain compatible with app render schemas", async () => {
  const { parserResultSchema, summarySchema } = await loadContractModules();
  assert.equal(
    parserResultSchema.safeParse(parsedArticleFixture).success,
    true,
  );
  assert.equal(
    parserResultSchema.safeParse(persistedArticleFixture.parsed_content)
      .success,
    true,
  );
  assert.equal(
    summarySchema.safeParse(persistedArticleFixture.summaries).success,
    true,
  );
});

// Sensor two — SQL-text assertion: a TypeScript constant has to appear
// verbatim in the migration's CHECK constraint, because a Zod value and
// a Postgres column share no symbol to hang a real check on.
test("Supabase persisted recommendation lane constraints stay aligned with shared lane values", async () => {
  const { recommendationLaneValues } = await loadContractModules();
  const laneConstraintSql = readFileSync(
    "supabase/migrations/20260410110000_add_user_recommendation_lane_to_articles.sql",
    "utf8",
  );
  const feedbackConstraintSql = readFileSync(
    "supabase/migrations/20260409150000_create_recommendation_feedback_events_table.sql",
    "utf8",
  );

  for (const lane of recommendationLaneValues) {
    assert.match(laneConstraintSql, new RegExp(`'${lane}'`));
    assert.match(feedbackConstraintSql, new RegExp(`'${lane}'`));
  }
});

// Sensor three — frozen-payload backward-compat: every request body a
// shipped extension version is known to send must still validate against
// today's API schema. The list is append-only.
test("add-article schema stays backward compatible with shipped extension payloads", async () => {
  const { addArticleRequestSchema } = await loadContractModules();

  for (const { version, description, body } of shippedAddArticlePayloads) {
    const result = addArticleRequestSchema.safeParse(body);
    assert.equal(
      result.success,
      true,
      `addArticleRequestSchema rejected a payload shipped by extension ${version} (${description})` +
        (result.success
          ? ""
          : `: ${JSON.stringify(result.error.issues)}. ` +
            "This is a breaking change for installed extensions — make the schema change additive/optional instead."),
    );
  }
});
```

Three sensors, one for each boundary that couldn't be collapsed. The first `safeParse`s real fixtures against the shared schema, the runtime move for a seam you can't close (fixtures, though, not live traffic: the only thing that truly crosses the seam is an end-to-end test, which is why it sits further down the cost curve as a slower backstop rather than something you run on every commit). The second asserts that a TypeScript constant appears verbatim in a migration's SQL, because the app and the database agree on a value with no shared symbol to enforce it, so you enforce it by grepping. The third replays every request body a shipped extension version is known to send. None of them checks code against a doc. They check code against code across a workspace boundary, and in one case code against a shipped binary.

### The contract that generates itself

One seam doesn't sit on the tier list at all, because neither end is hand-written. One end is *generated* from the other. The app's TypeScript types for the database (`database.types.ts`) aren't authored by anyone, they're generated from the SQL schema. The contract is real, but there's no hand-written assertion to make, because a human didn't write either side.

The sensor for a generated contract isn't an assertion, it's a regenerate-and-diff in CI. Run the generator against the current schema, and if the output differs from what's checked in, the types are stale and the build fails. You're not checking that two things agree, you're checking that one thing is a faithful function of the other.

```jsonc
// package.json — "scripts"
"db:gen-types": "supabase gen types typescript --local > app/lib/database.types.ts",
"db:check-types": "supabase gen types typescript --local > \"${TMPDIR:-/tmp}/more-later-db-types.ts\" && git --no-pager diff --no-index --exit-code -- app/lib/database.types.ts \"${TMPDIR:-/tmp}/more-later-db-types.ts\"",
```

```yaml
# .github/workflows/ci.yml — supabase-verify job
- name: Verify generated database types are in sync
  if: steps.supabase-changes.outputs.run == 'true'
  run: |
    if ! pnpm db:check-types; then
      echo "::error file=app/lib/database.types.ts::Generated Supabase types are out of date. Run 'pnpm db:gen-types' and commit the result."
      exit 1
    fi
```

The satisfying part came on day one. The instant I added the gate it failed, and it failed on drift that was *already there*: a `sites` table and an `articles.site_id` foreign key that had been living in the migrations for a while but had never been regenerated into the committed types. The guardrail found a body that was already buried before I installed it. You don't add these things because you predict the drift. You add them and discover the drift you'd been carrying.

### The consumer you can't reach

Every seam up to here had an escape hatch: collapse it, check it at build time, or check it at runtime. In each case you're working with code you control and can change today. One contract in More Later isn't like that, and it's the one that's stuck with me, because it's where the tidy story breaks.

The browser extension ships through a web store. Once someone installs it, that version sits in their browser, unchanged, until they happen to update, and I can't reach it. A shared source of truth does nothing for a binary that compiled three weeks ago and is out there hitting my API right now. Collapsing the seam protects the code that compiles *today*; the already-installed extension already compiled. So the only discipline left is backward compatibility: every change to the request the extension sends has to be additive, so last month's build talking to this month's API still gets understood. And "has to be" is doing dangerous work in that sentence, because it's a rule in my head, exactly the kind of thing this whole post has been arguing you can't rely on.

The backstop is a file that freezes the request body each shipped version is known to send (`tools/contracts/legacyExtensionPayloads.ts`, append-only), and CI asserts every frozen payload still validates against the current schema. Make a breaking change and some old payload stops validating and the build fails *here*, on my machine, instead of silently 400-ing an install I can't see and will never get a bug report from.

And here's the part I like most, because it won't let the post end tidy: that backstop *reintroduces the exact hole the post spent its middle warning about*. It only works if someone remembers to append the new payload every time a version ships. It depends on discipline. I climbed the whole ladder, from "write it down" to "delete the seam entirely," and the top rung, the consumer I can't reach, dropped me right back onto "remember to do the thing." The ladder doesn't get uniformly sturdier as you climb. Some rungs have soft spots, and pretending they don't is how you fall.

### Residue, not design

Like every other layer in this series, none of this was architected. There was no afternoon where I decided contract ownership was a discipline I wanted to adopt. There was a change that rippled across a boundary and broke something downstream, and when I went to figure out why, the coupling turned out to be completely real and written down absolutely nowhere. So I wrote it down. Then, doing the work, I found out writing it down was the floor. Some of these seams didn't want a note, they wanted to not exist, and the strongest thing I did all session wasn't a test I added. It was giving the app, the extension, and `ai/` one shared source to derive from, so the parser-shape drift that opens this post can't be authored at all. The best scar isn't the one with a test attached. It's the one you made unrepresentable, so there's nothing left to scar.

That's the ratchet again, pointed at the seams instead of the architecture or the docs. I walked into a wall, and instead of resolving to be more careful next time, I changed the shape of the repo so the wall couldn't be hit the same way twice. But the extension taught me the ratchet has a ceiling, or at least a soft spot: there's a consumer I can't reach, a rung that lands me back on discipline, and no amount of build-time cleverness deletes that. Writing a seam down, blocking a bad change to it, and deleting it outright are three strengths of the same idea, and which one you get is decided entirely by the physics of the boundary. But the boundary only decides which guardrail you *can* build, not how hard it's allowed to bite. That's what a control earns, climbing from a suggestion to a warning to a hard gate as its signal proves out. Enforcement isn't a switch you flip, it's a thing you steer up that ladder as trust accrues, and that turns out to be a practice of its own, the one this series closes on. For now the contracts file isn't something I'm proud of, exactly. Documenting a seam is the consolation prize for not being able to delete it, so the file is really a map of every seam I could see, annotated with which ones I managed to make disappear.

_This post was co-authored with [my agent assistant, Ryan Terry](/ryan-terry)._
