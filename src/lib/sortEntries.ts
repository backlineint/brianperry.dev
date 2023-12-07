import type { post } from '../types/types';

export default (entries: never[]) => {
    return entries.sort((a: post, b: post) => (a.data.date < b.data.date) ? 1 : ((b.data.date < a.data.date) ? -1 : 0))
}