<script>
  import "../app.css";
  import { base } from '$app/paths';
  import { page } from '$app/stores';
  
  const paths = [
    { name: 'About', href: '/' },
    { name: 'TIL', href: '/til' },
    { name: 'Lab', href: '/lab' }
  ];

  $: active = $page.url.pathname;

  function isActive(href) {
    return active === base + href || active.startsWith(base + href + '/');
  }
</script>

<svelte:head>
  <link
    href="https://fonts.googleapis.com/css2?family=Montserrat:wght@100;200;300&display=swap"
    rel="stylesheet"
  />
</svelte:head>

<nav class="bg-yellow-50 p-4 flex justify-center gap-10 shadow-sm">
  {#each paths as path}
    <a
      href={base + path.href}
      class="text-black tracking-wide text-center cursor-pointer transition-all duration-300 font-extralight hover:font-semibold"
      class:selected={isActive(path.href)}
      style="font-family: 'Montserrat', sans-serif;"
    >
      {path.name}
    </a>
  {/each}
</nav>

<main
  class="min-h-screen flex flex-col items-center justify-center bg-yellow-50 text-black px-4"
  style="font-family: 'Montserrat', sans-serif;"
>
  <slot />
</main>

<style>
  a.selected {
    font-weight: 600;
  }
  :global(a) {
    text-decoration: underline;
    color: black;
  }
  :global(a:hover) {
    color: #333333;
  }
  :global(pre) {
    background-color: #fef3c7;
    padding: 0.2em 0.4em;
    font-weight: 100;
    font-size: 0.875rem;
    margin-bottom: 1em; 
  }
  :global(nav a) {
    text-decoration: none;
  }
  :global(.code-block) {
    position: relative;
    margin: 0.5em 0;
    background-color: #fef3c7;
    border-radius: 0.2em;
    overflow: auto;
    padding: 1.25em 1em 0.01em 1em;
    font-family: monospace;
    font-size: 0.875rem;
    line-height: 1.4;
  }
  :global(.code-block > .language-label),
  :global(.code-block > .copy-btn) {
    top: 0.25em;
    transform: translateY(1px);
  }
  :global(.code-block) {
    position: relative;
  }
  :global(.code-block pre) {
    padding-top: 1rem;
  }
  :global(.code-block .language-label) {
    position: absolute;
    top: 0.25em;
    left: 0.5em;
    color: #81807eff;
    font-size: 0.75rem;
    background: transparent;
  }
  :global(.code-block .copy-btn) {
    position: absolute;
    top: 0.25em;
    right: 0.5em;
    font-size: 0.75rem;
    background-color: #fde68a;
    color: black;
    padding: 0.25em 0.5em;
    border-radius: 0.25rem;
    cursor: pointer;
  }
  :global(.mermaid code) {
    all: unset;
  }
  :global(h1) {
    font-size: 1.5rem;
    font-weight: 600;
    margin-bottom: 0.5em;
  }
  :global(h2) {
    font-size: 1.25rem;   
    font-weight: 600; 
    padding-top: 0.75rem; 
    margin-bottom: 0.5em;
  }
  :global(p) {
    margin-bottom: 1em; 
  }
  :global(ul) {
    list-style-type: disc;
    padding-left: 1.5em;
    margin-bottom: 1em;
  }
  :global(.copy-btn:hover) {
    background-color: #fcd34d;
  }
</style>
