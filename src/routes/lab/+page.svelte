<script lang="ts">
  import { articles } from '$lib/blog/articles';
  import { base } from '$app/paths';
</script>

<section class="w-full max-w-5xl mx-auto px-6 pt-8 pb-16 min-h-[calc(100vh-56px)]">
  <ul class="flex flex-col gap-4">
    {#each articles as article}
      <li class="flex items-baseline justify-between gap-6">
        <a
          href="{base}/lab/{article.slug}"
          class="article-link text-2xl font-light tracking-tight"
        >
          {article.title}
        </a>
        <time class="text-sm text-gray-500 shrink-0">{article.date}</time>
      </li>
    {/each}
  </ul>
</section>

<style>
  .article-link {
    text-decoration: none;
  }
  .article-link:hover {
    text-decoration: underline;
  }
</style>
