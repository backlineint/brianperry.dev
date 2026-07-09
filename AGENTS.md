# Development Notes

- **CSS changes to `src/styles/global.css` may not hot-reload.** The Astro dev server's file watcher sometimes doesn't pick up edits to `src/styles/global.css` mid-session — reloading the page keeps showing the old styles. If a CSS change isn't taking effect, restart the dev/preview server for a clean build rather than assuming the edit is wrong. (`global.css` is imported once in `src/components/BaseHead.astro`.)

# Writing Style Guide for brianperry.dev

When drafting or revising blog posts for this site, follow these guidelines to match Brian's voice.

## Tone and Voice

- Conversational and approachable — like talking to a knowledgeable friend, not writing a conference abstract.
- Self-deprecating humor is a key ingredient. Don't overdo it, but a post without at least one moment of self-awareness probably needs another pass.
- Be honest and direct about opinions. Brian doesn't hedge — he says what he thinks and owns it.
- Personal and grounded. Even technical posts should feel like they're coming from a real person with a life outside of code.

## Style

- Parenthetical asides are a signature move. Use them for quick jokes, qualifications, or offhand commentary.
- Short punchy sentences mixed with longer flowing ones. Vary the rhythm.
- Don't be afraid of sentence fragments for emphasis.
- Lists and bullet points are fine for organizing information, but add personality to individual items rather than keeping them dry.

## Structure

- Openings should be casual and direct. Get into it quickly.
- Closings should have personality — a joke, a callback, or something memorable. Avoid generic sign-offs like "I'd love to connect."
- Link back to other posts on the site when relevant. It adds context and makes the site feel connected.
- Descriptions in frontmatter should be specific to the post content, not generic summaries.

## Content

- Weave in personal details naturally — family, hobbies, the Patriots, Nintendo, guitar, etc. These ground the writing and make it feel authentic.
- When discussing technical topics, be practical and specific. Share real opinions rather than staying vague.
- Don't be afraid to name what you don't know or haven't done yet. Brian is open about learning in public.
- Pop culture references and analogies are welcome when they fit.

## Attribution

- When a concept, term, framing, or quote comes from someone else, credit them clearly and link the primary source inline — the post where it was actually coined, not a secondary mention that happens to use it.
- Credit the originator over the popularizer. If you're not sure who coined something, look it up before attributing rather than guessing.
- Don't dress up borrowed framing as your own. "What Addy Osmani calls the ratchet," not "what I think of as the ratchet."
- A parenthetical is the right tool for secondary lineage — noting the older or more formal name a term traces back to — without stacking a second link.
- Quotes should be exact and traceable to the thing you linked.

## What to Avoid

- Overly formal or corporate language.
- Vague statements that could apply to anyone ("I'm excited about the future of X"). Get specific about why.
- Trailing summaries that restate what was just said.
- Generic descriptions or titles that don't reflect the actual content.
- Excessive use of "I'm curious about" or "I'm looking forward to" without saying something concrete about why.
