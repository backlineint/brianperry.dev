import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';

import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
	site: 'https://brianperry.dev',
	integrations: [mdx(), sitemap()],
	redirects: {
		'/all': '/posts',
		'/til': '/posts',
		'/jams': '/posts',
	  }
});
