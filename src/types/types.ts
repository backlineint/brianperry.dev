import type { CollectionEntry } from "astro:content";

export type collections = "jams" | "posts" | "til";

export type post = CollectionEntry<"posts">
| CollectionEntry<"jams">
| CollectionEntry<"til">;
