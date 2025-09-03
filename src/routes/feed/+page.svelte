<script>
  import { codeCopy } from '$lib/actions/codeCopy';
  import { onMount } from 'svelte';
  import mermaid from 'mermaid';
  import { marked } from 'marked';
  import { renderer } from '$lib/markdown';
  import md2 from '$lib/blog/a_cookbook_for_a_weather_station_part_2.md?raw';
  import md1 from '$lib/blog/a_cookbook_for_a_weather_station_part_1.md?raw';
  
  marked.use({ renderer });

  const markdownFiles = [md2, md1];

  const htmlContents = markdownFiles.map(md => marked.parse(md));
  
  onMount(() => {
    mermaid.initialize({ startOnLoad: true });
    mermaid.init();
  });
  
</script>

<section class="w-full max-w-5xl mx-auto px-6 pt-4 pb-16 space-y-8">
  {#each htmlContents as content, i}
    <article use:codeCopy>
      <div class="markdown-content text-base text-gray-800 leading-relaxed">
        {@html content}
      </div>

      {#if i < htmlContents.length - 1}
        <hr class="border-t border-gray-300 mt-6" />
      {/if}
    </article>
  {/each}
</section>
