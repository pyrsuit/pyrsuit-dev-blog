<script>
  import { onMount } from 'svelte';

  let issues = [];
  let loading = true;
  let error = null;

  let title = '';
  let description = '';
  let submitting = false;
  let submitError = null;

  const encoded = import.meta.env.VITE_GITHUB_TOKEN_B64;
  const GITHUB_TOKEN = atob(encoded);
  const OWNER = 'pyrsuit';
  const REPO = 'pyrsuit-dev-blog';

  async function fetchIssues() {
    loading = true;
    try {
      const res = await fetch(`https://api.github.com/repos/${OWNER}/${REPO}/issues?per_page=10`, {
        headers: { Authorization: `Bearer ${GITHUB_TOKEN}` }
      });
      if (!res.ok) throw new Error(`GitHub API error: ${res.status}`);
      issues = await res.json();
      error = null;
    } catch (e) {
      error = e.message;
    } finally {
      loading = false;
    }
  }

  async function submitIssue() {
    submitError = null;
    if (!title) {
      submitError = 'Title is required';
      return;
    }
    submitting = true;

    try {
      const res = await fetch(`https://api.github.com/repos/${OWNER}/${REPO}/issues`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${GITHUB_TOKEN}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title,
          body: description
        })
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || `GitHub API error: ${res.status}`);
      }

      const newIssue = await res.json();
      issues = [newIssue, ...issues];
      title = '';
      description = '';
    } catch (e) {
      submitError = e.message;
    } finally {
      submitting = false;
    }
  }

  onMount(fetchIssues);
</script>

<section class="w-full max-w-5xl mx-auto px-6 pt-4 pb-16 space-y-8">
  <h1 class="text-2xl font-light tracking-tight">Contribute a topic — I'm gathering things to dig into</h1>

  <form on:submit|preventDefault={submitIssue} class="space-y-4">
    <div>
      <label for="title" class="block text-sm font-medium text-gray-700">Title</label>
      <input
        id="title"
        type="text"
        bind:value={title}
        required
        class="w-full mt-1 px-4 py-2 border border-gray-300 rounded-md shadow-sm bg-white focus:outline-none focus:ring focus:border-blue-300"
      />

    <label for="description" class="block text-sm font-medium text-gray-700">Description</label>
    <textarea
      id="description"
      rows="4"
      bind:value={description}
      class="w-full mt-1 px-4 py-2 border border-gray-300 rounded-md shadow-sm bg-white focus:outline-none focus:ring focus:border-blue-300"
    ></textarea>
    </div>

    <div>
      <button
        type="submit"
        disabled={submitting}
        class="border border-black text-black bg-transparent px-4 py-2 rounded-md transition font-normal hover:font-semibold disabled:opacity-50"
      >
        {submitting ? 'Submitting...' : 'Submit'}
    </button>
      {#if submitError}
        <p class="text-red-600 mt-2">{submitError}</p>
      {/if}
    </div>
  </form>

  <hr class="border-t border-gray-300 mt-10" />

  <div class="mt-10 space-y-4">
    {#if loading}
      <p class="text-gray-600">Loading issues…</p>
    {:else if error}
      <p class="text-red-600">Error: {error}</p>
    {:else if issues.length === 0}
      <p class="text-gray-600">No issues found.</p>
    {:else}
      <ul class="space-y-4">
        {#each issues as d}
          <li>
            <a
              href={d.html_url}
              target="_blank"
              rel="noopener noreferrer"
              class="text-black hover:underline text-lg"
            >
              {d.title}
            </a>
          </li>
        {/each}
      </ul>
    {/if}
  </div>
</section>
