---
date: 2025-07-19
slug: goodbye-temp-venv-hacks
tags:
  - TIL
  - Tooling
---

# Goodbye temp venv hacks 👋

Today I learned how much I enjoy using `uv` scripts for quick, one-off tasks.

<!-- more -->

You can define dependencies right at the top of the script, and when you run it with `uv`, it spins up a temporary virtual environment automatically. Once the script finishes, the environment is destroyed — super clean 🧹

This is perfect for things like initial tasks when starting a container, or scripts that import data, run a migration, or do any kind of setup that isn't needed once the main app is running.

💡 **Takeaway**: __[uv scripts](https://docs.astral.sh/uv/guides/scripts/)__ give you a disposable, isolated environment without any manual setup — ideal for clean, repeatable scripting without leaving a mess behind.
