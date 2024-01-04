import { getCollection } from 'astro:content';

import type { collections, post } from '../types/types';

export const getSortedCollection = async (collection: collections) => {
    const entries = await getCollection<collections>(collection);
    return entries.sort((a: post, b: post) => (a.data.date < b.data.date) ? 1 : ((b.data.date < a.data.date) ? -1 : 0));
}

export const getSortedCollectionByTag = async (collection: collections, tag: string) => {
    const entries = await getCollection<collections>(collection, ({ data }) => {
        return data.tags ? data.tags.includes(tag) : false;
      });
    return entries.sort((a: post, b: post) => (a.data.date < b.data.date) ? 1 : ((b.data.date < a.data.date) ? -1 : 0))
}