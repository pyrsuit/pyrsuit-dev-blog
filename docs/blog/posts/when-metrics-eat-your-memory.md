---
date: 2025-07-24
slug: when-metrics-eat-your-memory
tags:
  - TIL
  - Observability
  - Performance
---

# When metrics eat your memory 🧠 🍽️

Follow-up to my earlier post on Prometheus + Multiprocess Apps ... 

<!-- more -->

A few days in, I noticed the metrics directory was ballooning in memory 🎈 

Digging in, I realized the Prometheus Python client (in multiprocess mode) writes separate files per metric per process. By default, those files are named things like `counter_12345.db`, where `12345` is the PID.

So when a `uWSGI` worker dies and gets replaced — totally normal behavior — the new process gets its own set of metric files. But the old files? They just stay there.

Since the client doesn’t automatically clean up stale files, the directory just keeps growing.

✅ Fix: I configured a cleanup step to remove metrics for dead processes.

💡 Takeaway: In multiprocess mode, the metrics client tracks data per PID. Without cleanup, these files accumulate and quietly consume memory — especially in environments with frequent process restarts.
