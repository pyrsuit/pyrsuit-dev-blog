import { articles } from '$lib/lab/articles';
import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';

const markdownFiles = import.meta.glob('/src/lib/lab/*.md', { query: '?raw', import: 'default' });

export const entries = () => articles.map((a) => ({ slug: a.slug }));

export const load: PageLoad = async ({ params }) => {
	const article = articles.find((a) => a.slug === params.slug);
	if (!article) throw error(404);

	const loader = markdownFiles[`/src/lib/lab/${params.slug}.md`];
	if (!loader) throw error(404);

	const md = (await loader()) as string;
	return { article, md };
};