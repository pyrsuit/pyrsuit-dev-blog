<script>
  import posts from '$lib/til.json';
  import { marked } from 'marked';
</script>

<section class="w-full max-w-5xl mx-auto px-6 pt-4 pb-16 space-y-8">
  {#each posts as post, i}
    <article>
      <div class="flex items-baseline justify-between mb-2">
        <h2 class="text-2xl font-light tracking-tight">{post.title}</h2>
        <time class="text-sm text-gray-600 ml-4">{post.date}</time>
      </div>
      <div class="markdown-content text-base text-gray-800 leading-relaxed">
        {@html marked(post.text)}
      </div>

      {#if i < posts.length - 1}
        <hr class="border-t border-gray-300 mt-6" />
      {/if}
    </article>
  {/each}
</section>

<style>
  :global(.markdown-content a) {
    text-decoration: underline;
    color: black; /* Change link color to black */
  }
  :global(.markdown-content a:hover) {
    color: #333333; /* Slightly lighter black/gray on hover */
  }
</style>
