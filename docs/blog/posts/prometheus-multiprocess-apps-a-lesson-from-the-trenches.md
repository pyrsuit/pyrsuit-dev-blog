---
date: 2025-07-13
slug: prometheus-multiprocess-apps-a-lesson-from-the-trenches
tags:
  - TIL
  - Observability
---

# Prometheus + multiprocess apps: A lesson from the trenches

I recently deployed an API using `uWSGI` with multiple workers. I exposed a `/metrics` endpoint for `Prometheus` scraping — all looked good.

<!-- more -->

Until I realized… the metrics were off 🫠

Turns out, when you're using multiple `uWSGI` workers, `Prometheus`' Python client needs **multiprocess mode** enabled to aggregate metrics across all worker processes. Without it, each process exposes its own separate metrics — so counters, for example, appear to jump up and down instead of increasing cumulatively across all workers. 

✅ **Fix:** Configured __[multiprocess mode](https://prometheus.github.io/client_python/multiprocess/)__, so all workers write metrics to a shared directory.

💡 **Takeaway**: With multiple workers per replica, `Prometheus` scrapes the `/metrics` endpoint from only one worker per replica at random — so without multiprocess mode, your `Prometheus` metrics won't reflect the true state of your API — making it impossible to accurately track what's really happening.
