// Shared view-transition-name for a post's image, so the card thumbnail on the
// homepage / post list and the hero image on the post page belong to the same
// transition group and morph into place on navigation. Card and hero MUST agree
// on this string, so both sides derive it from here rather than inlining it.
export const postTransitionName = (collection: string, slug: string): string =>
  // Prefix keeps it from starting with a digit and slashes/odd chars become
  // dashes so the result is a valid CSS <custom-ident>.
  `post-img-${collection}-${slug}`.replace(/[^a-zA-Z0-9_-]/g, "-");
