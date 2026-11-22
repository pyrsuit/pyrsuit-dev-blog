---
date: 2025-08-19
slug: the-one-when-truncate-locked-me-out
tags:
  - TIL
  - Testing
  - Databases
---

# The one when TRUNCATE locked me out 🚪🔒

While running `pytest` with `MySQL`, I kept hitting tests stuck on: `Waiting for table metadata lock` 😫 

<!-- more -->

Digging in, I found the culprit: my fixtures were using `TRUNCATE TABLE` to clean test data between runs. 

Here's the catch: In MySQL, `TRUNCATE` is __[DDL](https://en.wikipedia.org/wiki/Data_definition_language)__, not __[DML](https://en.wikipedia.org/wiki/Data_manipulation_language)__. It drops/recreates the table under the hood, resets `AUTO_INCREMENT`, and requires an **exclusive metadata lock**. If any transaction has touched the table — even just a `SELECT` — `TRUNCATE` will block until that lock is released. In `pytest`, with long-lived connections, this happened constantly. 

✅ **Fix:** switched to `DELETE FROM` table for cleanup. `DELETE` is `DML`, transactional, and only takes row locks + short metadata locks. It doesn't reset `AUTO_INCREMENT`, but it doesn't block other transactions either. 

💡 **Takeaway:**: In `MySQL` tests, prefer `DELETE` over TRUNCATE unless you can guarantee no open transactions. 

🔄 **Postgres comparison**: `TRUNCATE` in `Postgres` is transactional — you can roll it back, and it doesn't block in the same way. It still takes stricter locks than `DELETE`, but because `Postgres` metadata locking is less rigid, it rarely causes the same “hung DDL” issues you see in `MySQL`.
