<script lang="ts">
  import { codeCopy } from '$lib/actions/codeCopy';
  import { onMount } from 'svelte';
  import mermaid from 'mermaid';
  import { marked } from 'marked';
  import { renderer } from '$lib/markdown';
  import { base } from '$app/paths';

  export let data;

  marked.use({ renderer });

  const html = marked.parse(data.md) as string;

  onMount(() => {
    mermaid.initialize({ startOnLoad: true });
    mermaid.init();
  });
</script>

<section class="w-full max-w-5xl mx-auto px-6 pt-4 pb-16">
  <div class="flex justify-end mb-6">
    <a href="{base}/lab" class="text-sm font-light tracking-wide no-underline hover:underline">← Back to Lab</a>
  </div>
  <article use:codeCopy>
    <div class="markdown-content text-base text-gray-800 leading-relaxed">
      {@html html}
    </div>
  </article>
  <div class="flex justify-end mt-8">
    <a href="{base}/lab" class="text-sm font-light tracking-wide no-underline hover:underline">← Back to Lab</a>
  </div>
</section>
