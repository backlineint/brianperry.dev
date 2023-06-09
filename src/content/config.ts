// 1. Import utilities from `astro:content`
import { z, defineCollection } from 'astro:content';
// 2. Define your collection(s)
const postCollection = defineCollection({
    type: 'content', // v2.5.0 and later
    schema: ({image}) => z.object({
      title: z.string(),
      description: z.string(),
      author: z.string(),
      date: z.date(),
      imagePath: image().optional(),
      alt: z.string().optional(),
    }),
  });
// 3. Export a single `collections` object to register your collection(s)
//    This key should match your collection directory name in "src/content"
export const collections = {
  'jams': postCollection,
  'posts': postCollection
};