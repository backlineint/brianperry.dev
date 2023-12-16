import rss from '@astrojs/rss';
import sanitizeHtml from 'sanitize-html';
import MarkdownIt from 'markdown-it';
import { SITE_TITLE, SITE_DESCRIPTION } from '../consts';
import getSortedCollection from "../lib/getSortedCollection";
import sortEntries from "../lib/sortEntries";

const parser = new MarkdownIt();

export async function GET(context) {
	const jamsEntries = await getSortedCollection("jams");
	const postsEntries = await getSortedCollection("posts");
	const tilEntries = await getSortedCollection("til");

	const allEntries = [...jamsEntries, ...postsEntries, ...tilEntries];
	const sortedEntries = sortEntries(allEntries);

	return rss({
		title: SITE_TITLE,
		description: SITE_DESCRIPTION,
		site: context.site,
		customData: `<language>en</language>`,
		items: sortedEntries.map((post) => ({
			title: post.data.title,
			description: sanitizeHtml(parser.render(post.body)),
			link: `/${post.collection}/${post.slug}/`,
			pubDate: post.data.date,
		})),
	});
}
