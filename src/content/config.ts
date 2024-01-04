import { defineCollection, z } from 'astro:content';

const postCollection = defineCollection({
	type: 'content', // v2.5.0 and later
	schema: ({ image }) => z.object({
		title: z.string(),
		description: z.string(),
		author: z.string(),
		date: z.coerce.date(),
		imagePath: image().optional(),
		alt: z.string().optional(),
		feed_excerpt: z.string().optional(),
		tags: z.array(z.string()).optional(),
	}),
});

export const collections = {
	'jams': postCollection,
	'posts': postCollection,
	'til': postCollection,
};
