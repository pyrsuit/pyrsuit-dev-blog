<script>
  import { base } from '$app/paths';
</script>

<svelte:head>
  <title>Contact</title>
</svelte:head>

<section class="w-full max-w-5xl mx-auto px-6 pt-4 pb-16">
  <h1 class="text-2xl font-light tracking-tight mb-4">Get in touch</h1>
  <p class="font-extralight text-base text-gray-800">
    If you enjoy the blog and want to say hi, share feedback, or just chat - I'd love to hear from you  I'd love to hear from you 😊
  </p>
  <a href="mailto:hello@pyrsuit.dev" class="font-light">hello@pyrsuit.dev</a>
  <p class="font-extralight text-base text-gray-800 mt-6">
    You can also follow the blog via the <a href="{base}/feed.json" class="font-light">JSON feed</a> to get updates on new articles.
  </p>
</section>
