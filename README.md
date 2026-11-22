# pyrsuit.dev

Source of [pyrsuit.dev](https://pyrsuit.dev), built with [Zensical](https://zensical.org) and managed with [uv](https://docs.astral.sh/uv/).

## Developing

```bash
uv sync
uv run zensical serve        # http://localhost:8000
```

## Building

```bash
uv run zensical build --clean   # output in site/, incl. feed.json and feed.xml
```

Pushing to `main` builds and deploys to GitHub Pages (`.github/workflows/deploy.yml`).

## Content

All posts live in one blog (Zensical blog plugin) at `docs/blog/posts/<slug>.md`, served at `/blog/<slug>/`.

```markdown
---
date: 2026-11-22
slug: my_post
draft: true          # optional: visible in `zensical serve`, left out of `zensical build`
tags:
  - TIL              # type: TIL (short note) or Lab (longer write-up)
  - Performance      # one or more topic tags
---

# My post

Intro paragraph shown on the blog index.

<!-- more -->

Rest of the post.
```

- **Excerpt**: `<!-- more -->` is required in every post; the build fails without it.
- **Tags**: must come from `tags_allowed` in `zensical.toml` (the build fails on unknown tags, which
  catches typos). Add new topics there. `/tags/` lists posts per tag, and tags are searchable.
- **Drafts**: remove `draft: true` (or set it to `false`) to publish.

The RSS plugin writes `feed.xml` and `feed.json`. Old `/til/<slug>/` and `/lab/<slug>/` URLs redirect via
`redirect_maps` in `zensical.toml`: no need to add entries for new posts.

Other files: `docs/contact.md` (Contact), `docs/tags.md` (tag index),
`docs/stylesheets/extra.css` (light yellow theme).
