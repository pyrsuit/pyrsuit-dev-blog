<script>
  import { codeCopy } from '$lib/actions/codeCopy';
  import posts from '$lib/til.json';
  import { renderer } from '$lib/markdown';
  import { marked } from 'marked';
  import { page } from '$app/stores';

  marked.use({ renderer });

  const PER_PAGE = 5;
  const totalPages = Math.ceil(posts.length / PER_PAGE);

  $: currentPage = Math.max(1, Math.min(parseInt($page.url.searchParams.get('page') || '1'), totalPages));
  $: start = (currentPage - 1) * PER_PAGE;
  $: pagePosts = posts.slice(start, start + PER_PAGE);
</script>

<section class="w-full max-w-5xl mx-auto px-6 pt-4 pb-16 space-y-8">
  {#if totalPages > 1}
    <div class="flex items-center justify-end gap-6 pb-2">
      {#if currentPage > 1}
        <a href="?page={currentPage - 1}" class="font-extralight text-sm">← prev</a>
      {/if}
      <span class="font-extralight text-sm text-gray-500">{currentPage} / {totalPages}</span>
      {#if currentPage < totalPages}
        <a href="?page={currentPage + 1}" class="font-extralight text-sm">next →</a>
      {/if}
    </div>
  {/if}

  {#each pagePosts as post, i}
    <article use:codeCopy>
      <div class="flex items-baseline justify-between mb-2">
        <h1 class="text-2xl font-light tracking-tight">{post.title}</h1>
        <time class="text-sm text-gray-600 ml-4">{post.date}</time>
      </div>
      <div class="markdown-content text-base text-gray-800 leading-relaxed">
        {@html marked(post.text)}
      </div>

      {#if i < pagePosts.length - 1}
        <hr class="border-t border-gray-300 mt-6" />
      {/if}
    </article>
  {/each}

  {#if totalPages > 1}
    <div class="flex items-center justify-end gap-6 pt-4">
      {#if currentPage > 1}
        <a href="?page={currentPage - 1}" class="font-extralight text-sm">← prev</a>
      {/if}
      <span class="font-extralight text-sm text-gray-500">{currentPage} / {totalPages}</span>
      {#if currentPage < totalPages}
        <a href="?page={currentPage + 1}" class="font-extralight text-sm">next →</a>
      {/if}
    </div>
  {/if}
</section>
