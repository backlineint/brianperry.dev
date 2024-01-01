import { getCollection } from 'astro:content';

import type { collections, post } from '../types/types';

export default async (collection: collections) => {
    const entries = await getCollection<collections>(collection);
    return entries.sort((a: post, b: post) => (a.data.date < b.data.date) ? 1 : ((b.data.date < a.data.date) ? -1 : 0))
}