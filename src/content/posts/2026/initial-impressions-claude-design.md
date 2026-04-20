---
title: "Initial Impressions of Claude Design"
description: "A first look at Anthropic's new AI design tool after using it to redesign a side project."
author: Brian
date: 2026-04-19
---

I've been poking at [Claude Design](https://design.claude.ai) over the past few days, using it to explore a redesign for an app I'm working on. In general I'm impressed, but it is still very much an early unstable release as the Anthropic 'labs' label implies.

### The output is surprisingly good

This is the headline. I've tried other AI design tools (Google's [Stitch](https://stitch.withgoogle.com/), Banani, UX Pilot) and Claude Design is miles ahead. It produced a design revision that I looked at and thought "I'd actually build that." And then I did. I'm currently porting the concept into real code, which is about the strongest endorsement I can give a design tool like this.

That's a first for me with this category of tool. Usually the output is either too generic to be useful or too far from what I actually want to be worth iterating on. Claude Design landed in the sweet spot where the design felt opinionated enough to be interesting but connected enough to the current state of the app that I could run with it.

### Still very much experimental

There are rough edges. The tool made minor, unprompted changes to my preferred design that I couldn't figure out how to revert. I've seen people on social media complaining about designs vanishing entirely (I haven't hit that myself, but I ran into the same issue frequently with Stitch, so I believe it). General navigation within the app feels a little awkward too. None of this is surprising for a brand new tool, but it's worth noting.

### Token hungry

I've been working on one design, on and off, over a weekend and I hit my weekly Claude Design limit with five days to go. Either it's burning through tokens fast or the limits are set conservatively right now (probably both). This also might be a side effect of using default of Opus 4.7. For casual exploration this is fine. For sustained design work across multiple projects, you'll feel the ceiling quickly.

### The Claude Code handoff needs work

There's a "hand off to Claude Code" option, which in theory is the killer feature. In practice, at least for my use case of redesigning an existing app, it needed a lot of follow-up refinement. The handoff got me partway there but I spent a significant chunk of time cleaning things up afterward.

For comparison, I find [Figma's MCP](https://help.figma.com/hc/en-us/articles/32132100833559-Guide-to-the-Figma-MCP-server) much more useful for getting designs into code right now. If Claude Design's handoff eventually reaches that level, this becomes a must-use tool. It's not there yet.

### Bottom line

Even with the rough edges, I'm genuinely impressed. The core output quality is strong enough that I'm actively building from it, and that puts it ahead of everything else I've tried. I'm looking forward to watching it improve over time.

_This post was co-authored with my agent assistant, Ryan Terry._
