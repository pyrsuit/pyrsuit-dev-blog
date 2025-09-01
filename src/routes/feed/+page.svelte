<script>
  import { codeCopy } from '$lib/actions/codeCopy';
  import { onMount } from 'svelte';
  import mermaid from 'mermaid';
  import { marked } from 'marked';
  import { renderer } from '$lib/markdown';
  import postRaw from '$lib/blog/a_cookbook_for_a_weather_station_part_1.md?raw';
  
  marked.use({ renderer });
  let html = marked.parse(postRaw);
  
  onMount(() => {
    mermaid.initialize({ startOnLoad: true });
    mermaid.init();
  });
  
</script>

<section class="w-full max-w-5xl mx-auto px-6 pt-4 pb-16 space-y-8">
  <article use:codeCopy>
    {@html html}
  </article>
</section>
