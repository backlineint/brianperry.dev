---
title: Confessions from the World's Worst Vibe Coder
description: A year, nearly 2,000 commits, 100+ TestFlight builds, and still not shipped — and why that turned out to be fine.
author: Brian Perry
date: 2026-06-22
imagePath: "./worlds-worst-vibe-coder.png"
alt: "Brian accepting an award for world's worst vibe coder"
---

When the term "[vibe coding](https://en.wikipedia.org/wiki/Vibe_coding)" kept showing up in my social media feeds, the idea was intoxicating. Describe what you want, let the agent go wild, and ship it. Don't read the diffs. Don't sweat the architecture. Just make something.

So I pretty much immediately started a project. The date stamp on the first commit is March 14, 2025, which in AI years might as well be decades ago. The idea was simple: a read-it-later app, but smarter. Something that didn't just hoard articles in a guilt pile but actually helped me decide what was worth my time. True to the vibe coding excitement, I created the repo in a folder called vibe-paper (as in my vibe coded version of Instapaper).

Here's my vibe coding scorecard. Nearly 2,000 commits. Well over 100 TestFlight builds. More than a year of nights and lunch breaks. Renamed it More Later (as in 'Read More Later') along the way. And the app is still not publicly shipped.

By every metric the original vibe coding fantasy promised, I am a catastrophic failure. Worst vibe coder alive. Possibly in recorded history.

But interestingly enough, I'm still at it.

### The vibe was a lie (for me, anyway)

The thing nobody mentioned in those early breathless threads is that vibing only gets you to a demo. A demo is a beautiful, fragile thing. It works once, in good lighting, with the one input you tested. Then a real person opens your app, taps the button you forgot existed, and the whole thing folds like a lawn chair.

More Later didn't want to be a demo. It wanted to be software I actually used. And the gap between "the model generated something plausible" and "this survives me using it every single day" turned out to be really large. That gap is where most of the last year-plus went.

The other thing that happened over that period of time is that coding agents got exponentially better. Eventually the vibes and their limitations faded away, and I was left with a newly viable process for building software and an app that was looking more and more like an honest-to-god real thing every day.

So no, I didn't vibe my way to a finished product. I worked my way there slowly, learning how to build software as a solo dev, and watched as my coding agent riding shotgun kept becoming more and more capable.

### A side project is a great place to be wrong

Here's the thing I didn't fully appreciate when I started. A long-running side project that nobody's waiting on is the single best laboratory you can have for this stuff.

Every time a new AI coding concept showed up, I had somewhere to throw it. Planning workflows. Orchestrators that pick up issues and open PRs. Linear automation. Visual verification so the agent could actually see what it built. Design tooling. Garbage-collection audit scripts to keep the codebase honest. Some of it worked beautifully. Plenty of it didn't (I have a small graveyard of abandoned experiments, and I regret nothing).

The point was never that every experiment paid off. The point was that I had a real codebase, with real users of one, where being wrong cost me nothing but time and taught me a ton. You can't learn the shape of these tools by reading about them. You have to break something you care about.

### Knowing when you don't have "it"

I'm still not great at knowing when a feature is right. When I've got "it." That instinct comes slowly, and honestly some days it doesn't come at all. But somewhere across those hundred-plus builds I got really, really good at knowing when I **don't** have it. When a design is fighting me. When a feature feels bolted on. When the thing I just shipped to TestFlight is technically functional and spiritually wrong.

That sounds like a small thing. It isn't. Half of building good software is just refusing to lie to yourself about the bad version. The agent will happily build whatever you ask. It will not tell you the idea was mediocre. That part is still your job, and it took me a long time and a lot of bad builds to get a reliable read on it.

It took a lot of evolution, but I'm finally starting to trust that read. That's a genuine milestone.

### "Not shipped" is just personal software

In the old world, an unshipped side project is a failure-in-waiting. A thing you're embarrassed to mention at parties. "Oh that? Yeah, still working on it." Sad trombone.

But in the age of AI, a not-yet-shipped side project is just [personal software](https://leerob.com/personal-software). Software built by one person, for one person, that does exactly what that person wants. And by that standard More Later isn't a failure at all. It's a success I use every day. I actually enjoy reading in the app. It triages my reading into lanes so I'm not staring at an undifferentiated wall of saved links. It's opinionated in the ways I'm opinionated. It fits my brain because it was built one stubborn commit at a time to fit my brain.

That's not a consolation prize. That's the whole point of building things, and somewhere along the way I stopped seeing it as a step to "real" shipping and started seeing it as a perfectly good destination.

### What's next

That said, I think it might be good for other people too. And the only way to find out is to do the scary thing the world's worst vibe coder has been avoiding for over a year: let someone else open the app.

So that's the next step. Get it in front of real users, the kind who'll tap the button I forgot existed, and find out whether the thing I built for an audience of one has an audience of more than one.

If it doesn't, that's fine. I'll still have my personal software, and a year of learning how this whole new way of building actually works.

But I've got a hunch I don't _not_ have it.
