<script>
  import "../app.css";
  import { page } from '$app/stores';

  const paths = [
    { name: 'About', href: '/blog' },
    { name: 'Feed', href: '/blog/feed' },
    { name: 'TIL', href: '/blog/til' },
    { name: 'Lab', href: '/blog/lab' }
  ];

  $: active = $page.url.pathname;

  function isActive(href) {
    return active === href || active.startsWith(href + '/');
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
      href={path.href}
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
    font-weight: 600; /* semibold for active link */
  }
</style>
