import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
	// Type-check frontmatter using a schema
	schema: z.object({
		title: z.string(),
		description: z.string(),
		// Transform string to Date object
		pubDate: z.coerce.date(),
		updatedDate: z.coerce.date().optional(),
		heroImage: z.string().optional(),
	}),
});

const postCollection = defineCollection({
	type: 'content', // v2.5.0 and later
	schema: ({ image }) => z.object({
		title: z.string(),
		description: z.string(),
		author: z.string(),
		date: z.date(),
		imagePath: image().optional(),
		alt: z.string().optional(),
		feed_excerpt: z.string().optional()
	}),
});

export const collections = {
	blog,
	'jams': postCollection,
  'posts': postCollection,
  'til': postCollection,
};
