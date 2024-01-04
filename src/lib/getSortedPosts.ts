import { getSortedCollection, getSortedCollectionByTag } from "./getSortedCollection";
import type { post } from '../types/types';

export const getSortedPosts = async (results? : number) => {
    const jamsEntries = await getSortedCollection("jams");
    const postsEntries = await getSortedCollection("posts");
    const tilEntries = await getSortedCollection("til");
    const entries = [...jamsEntries, ...postsEntries, ...tilEntries];

    const sortedEntries =  entries.sort((a: post, b: post) => (a.data.date < b.data.date) ? 1 : ((b.data.date < a.data.date) ? -1 : 0))
    return results ? sortedEntries.slice(0, results) : sortedEntries;
}

export const getSortedPostsByTag = async (tag: string, results? : number) => {
    const jamsEntries = await getSortedCollectionByTag("jams", tag);
    const postsEntries = await getSortedCollectionByTag("posts", tag);
    const tilEntries = await getSortedCollectionByTag("til", tag);
    const entries = [...jamsEntries, ...postsEntries, ...tilEntries];

    const sortedEntries =  entries.sort((a: post, b: post) => (a.data.date < b.data.date) ? 1 : ((b.data.date < a.data.date) ? -1 : 0))
    return results ? sortedEntries.slice(0, results) : sortedEntries;
}