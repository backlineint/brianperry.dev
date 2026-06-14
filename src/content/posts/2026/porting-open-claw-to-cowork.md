---
title: "Porting My OpenClaw Assistant to Claude Cowork"
description: "Why I migrated my self-hosted stateful agent from OpenClaw to Claude Cowork."
author: Brian
date: 2026-04-13
---

In early January I saw a number of people I follow exploring the concept of building stateful agent assistants. What really caught my attention was [Tim Kellogg's post about Strix the Stateful Agent](https://timkellogg.me/blog/2025/12/15/strix). Inspired, I started building my own. The goal was that it would be my daily driver for keeping track of what I was working on, prepping for standups, and generally offloading the mental overhead of maintaining a work log.

And then, as things go these days, [OpenClaw](https://openclaw.ai/) (Clawdbot at the time) came along and upended everything. Out of the box OpenClaw could do everything I was trying to build and a lot more. So I switched over. It mostly worked - but it required real effort to maintain, and I found myself spending more time managing bugs and infrastructure than actually using the assistant. That friction is what eventually pushed me toward Cowork: I wanted to see how much of the same workflow I could rebuild without worrying about the infrastructure at all.

This post walks through what I built, how I built it, and what the migration looked like in practice.

## What OpenClaw Did

If given the permissions, OpenClaw can do just about anything. But my initial goals were pretty simple. At its core, my OpenClaw was an assistant hosted on a VPS (I'm not currently willing to let it run wild on a machine on my network) and wired up to a few key workflows:

- **Work logging** - I could tell it what I was working on and it would keep a running, timestamped log
- **Standup summaries** - It would pull from the log and generate a concise summary for my morning standup automatically 15 minutes before the start of the meeting.
- **Periodic check-ins** - If I'd gone quiet for a while, it would nudge me for an update
- **Blog post brainstorming** - It could review my recent work log and suggest angles for posts

I also needed it to be available across all of my devices. For this setup, this was accomplished by communicating with OpenClaw via Discord.

The pain points were mostly operational: keeping the self-hosted model updated, managing the infrastructure, and dealing with the occasional reliability quirk. I also ran into Anthropic rate limits off and on that I had to debug.

Since this was meant to make my life easier, even small hiccups and debugging were pretty much a non-starter. I do enough debugging every day, the last thing I want is to have to maintain what is essentially a fancy journal that keeps breaking in new and interesting ways.

I have no doubt that the workflow introduced by OpenClaw is here to stay. I'm just going to have to revisit it when it is ready for more than just the earliest of early adopters.

## Why Cowork

Cowork solved the specific pain points I was hitting with OpenClaw. No VPS to maintain, no updates to stay on top of, no rate limits to debug - just a desktop app from Anthropic with built-in scheduled tasks and persistent file access to a folder on my machine.

The tradeoffs are real. Cowork is much more locked down than OpenClaw and runs in a sandbox. Going from the freewheeling nature of OpenClaw to the workflow-oriented nature of Cowork meant giving some things up - no out of the box agent memory, no Discord bot I could ping from my phone, and no ability to wire up arbitrary integrations on a whim. But I felt confident that most of the process I was aiming for would be possible in either system, just with different mechanics. Worst case, I'd learn about the limits of Cowork and keep looking.

## Building the Basic Workflow

### The Work Log

The first thing I asked Cowork to set up was `worklog.md` — a plain markdown file that serves as the running log of everything I work on. The format is simple:

```
## 2026-03-14

**16:30 UTC** — Reviewed and merged an update to the More Later browser plugin...

**16:47 UTC** — Did initial setup of the Claude Cowork system...
```

I tell Claude what I'm working on in plain language, and it handles the timestamp (via bash) and appends the entry under the correct date heading. No special syntax required on my end.

As I started adding work log entries, I realized that I needed light categorization. Essentially to keep noise out of my daily standup updates I needed to determine what was business and what was personal. I can provide a category when I update, but if I don't the agent will assign one for me. If it doesn't have enough information to know for sure, it asks.

### Scheduled Check-ins

This system is really only useful if I stay current with updates. It is extremely easy to get heads-down on something and forgot to log it, and then completely forget what I have been working on for the past five hours. As a result, I often need a poke to be reminded to update the work log.

In Cowork, I set this up as a scheduled task that runs at 9am, 11am, 1pm, and 3pm on weekdays. Each time it fires, it reads `worklog.md`, checks the timestamp of the most recent entry, and — if it's been more than two hours — asks me for an update. If there's a recent entry, it stays quiet.

### Daily Standup Summary

At 10:45am every weekday, a second scheduled task reads the last 24 hours of `worklog.md` and generates a concise standup summary. By the time my standup rolls around, I've got a tight summary of what I worked on the day before, ready to go.

### Blog Post Brainstorming and Publishing

This one is on-demand rather than scheduled. When I want to brainstorm blog ideas, I ask Claude to review recent log entries and surface anything worth writing about — interesting technical decisions, workflows, tools. It suggests angles and titles, then helps me draft the post when I've picked one. (Meta note: this post was kicked off exactly that way.)

Drafts get saved to a `blog/` subfolder in the Cowork workspace. When I'm ready to publish, Claude handles the conversion to site format — transforming the draft into the frontmatter and markdown structure my Astro site expects, writing it directly into the repo at `src/content/posts/YEAR/filename.md`, and wiring up any images alongside the post file.

The one thing Cowork can't easily do is run the dev server for a live preview. For that step I hand off to Claude Code, which can run `pnpm dev` locally without any issues. It's a minor seam in an otherwise smooth workflow.

## Persisting the Workflow

### CLAUDE.md as the System's Source of Truth

One of the things that makes OpenClaw feel like magic is its memory system. Cowork does not have this out of the box. But since it is Claude at the end of the day, it is easy to add.

The glue holding all of this together is `CLAUDE.md`, a markdown file that Cowork reads at the start of every session. It documents the entire system: how to add log entries, how to generate standup summaries, what the scheduled tasks do, and an instruction to keep itself updated whenever the system changes.

```markdown
# Claude Instructions

## Keeping This File Up To Date

Whenever changes are made to this system — such as adding new scheduled tasks,
modifying workflows, or updating logging behavior — this file should be updated
immediately to reflect those changes. CLAUDE.md is the source of truth for how
this setup works, so it should always stay current.
```

When I want to establish a repeatable process like the daily standup summary, I'll ask Cowork to document it in Claude.md. It typically does a great job writing rules for itself to follow. I wish I was as good at that. And if Cowork needs another nudge, I can always modify CLAUDE.md manually.

```markdown
### Daily standup summary

When Brian asks for a standup summary, read `worklog.md` and summarize all entries from the last 24 hours in a concise standup format:

- Group entries into **Actual AI** and **Personal** sections
- What was worked on / completed
- Keep it brief and scannable — this is for a standup, not a report
```

### Sync

In order to use this on more than one device, we need to sync these files. This was harder than I expected using OpenClaw on a VPS - logging into the server to access the files is inconvenient, and committing them using git could work but was not as lightweight as I wanted this process to be.

For this new setup, I just took a lo-fi approach and configured iCloud sync for the folder that Cowork operates in. This allows me to use this assistant on any Mac that I have the Claude app installed on. The one manual thing I have to do when using Cowork on a new machine is ask the agent to create the scheduled tasks referenced in CLAUDE.md. Those do not get created automatically.

For mobile, I can use the dispatch feature to use Cowork remotely when my machine is on. That only gets me some of the way there as it requires my machine to be powered on and awake, and isn't quite the same interface as Cowork on desktop. For cases where dispatch won't work, I also have this folder configured as an Obsidian vault and can edit the necessary markdown files directly.

## Takeaways

I'm happy with this workflow on Cowork so far. I know I'm missing out on the magic of having a fully autonomous OpenClaw agent, but I gain quite a bit in return. Not having to maintain a VPS means I'm not responsible for securing the box it runs on, and Cowork's sandbox means I'm not lying awake wondering what my agent decided to do at 2am. On the reliability front, I've never really had to "fix" anything about this workflow since I established it. No mysterious rate limits, no debugging infrastructure - just a reliable worklog that, for once, doesn't keep breaking. (This post, for what it's worth, was brainstormed, drafted, and published using the very workflow it describes. So at least the system works well enough to write about itself.)

The biggest concrete loss is cross-device availability. OpenClaw via Discord meant I could log updates from anywhere. Cowork is Mac-only, and while dispatch and Obsidian fill some of the gap, it's not the same seamless experience. That's a real tradeoff worth knowing about upfront.

Perhaps over time I'll run into more limitations as I try to do more with it, but I also suspect that Cowork's feature set will continue to expand. Either way, if your assistant needs its own assistant, something's probably off.

_This post was co-authored with [my agent assistant, Ryan Terry](/ryan-terry)._
