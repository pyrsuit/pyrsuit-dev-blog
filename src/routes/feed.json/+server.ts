import { articles } from '$lib/lab/articles';
import tilData from '$lib/til.json';

const SITE_URL = 'https://pyrsuit.dev';

function parseDate(dateStr: string): Date {
	return new Date(dateStr.replace('- ', '').trim());
}

export const prerender = true;

export function GET() {
	const labItems = articles.map((a) => ({
		id: `${SITE_URL}/lab/${a.slug}`,
		url: `${SITE_URL}/lab/${a.slug}`,
		title: a.title,
		date_published: parseDate(a.date).toISOString(),
		tags: ['lab']
	}));

	const tilItems = (tilData as Array<{ title: string; date: string; text: string }>).map((t) => ({
		id: `${SITE_URL}/til#${encodeURIComponent(t.title)}`,
		url: `${SITE_URL}/til`,
		title: t.title,
		content_text: t.text,
		date_published: parseDate(t.date).toISOString(),
		tags: ['til']
	}));

	const allItems = [...labItems, ...tilItems].sort(
		(a, b) => new Date(b.date_published).getTime() - new Date(a.date_published).getTime()
	);

	const feed = {
		version: 'https://jsonfeed.org/version/1.1',
		title: 'pyrsuit dev blog',
		home_page_url: SITE_URL,
		feed_url: `${SITE_URL}/feed.json`,
		description: 'Lab articles and TIL entries from pyrsuit dev blog',
		items: allItems
	};

	return new Response(JSON.stringify(feed, null, 2), {
		headers: {
			'Content-Type': 'application/feed+json',
			'Cache-Control': 'max-age=0, s-maxage=3600'
		}
	});
}
