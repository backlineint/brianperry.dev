/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

// reveal.js ships no type declarations; treat its entrypoints as `any`.
declare module "reveal.js";
declare module "reveal.js/plugin/markdown/markdown.esm.js";
declare module "reveal.js/plugin/notes/notes.esm.js";
