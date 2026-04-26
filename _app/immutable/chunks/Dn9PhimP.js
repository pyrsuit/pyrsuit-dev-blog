const e=`<div class="flex items-baseline justify-between mb-2">
  <h1 class="text-2xl font-light tracking-tight">No GIL, no cry?</h1>
  <time class="text-sm text-gray-600 ml-4">April 26, 2026</time>
</div>

> *Testing **Python 3.13**'s free-threaded build with \`asyncio\`, real OS threads, and a semaphore.*

## Some background first
 
**Python 3.13** shipped one of the most significant changes in the language's history: the **GIL** - the **Global Interpreter Lock** - is *optional*. For years, the GIL has been the reason **Python** threads can't truly run in parallel. Only one thread holds the lock at a time, so CPU-bound work serializes even when you spawn a dozen threads. Free-threaded **CPython** (the \`+freethreaded\` build) removes that constraint entirely.
 
I wanted to see it with my own eyes. Not just read about it - actually run code, watch the threads, and check the difference is real.

## What is the GIL, briefly?
 
The GIL is a **mutex** inside **CPython** that protects the interpreter's internal state. It means only one thread can execute **Python** bytecode at any moment. For I/O-bound work this barely matters - threads spend most of their time waiting anyway. But for CPU-bound work, it's a hard ceiling: no matter how many cores your machine has, standard CPython threads **don't truly parallelize**.
 
The free-threaded build **removes** the GIL, allowing threads to run **Python** bytecode simultaneously across cores.

## The setup
 
**Python:** CPython 3.13 (with GIL) vs CPython 3.13+freethreaded (no GIL)  
**Tool:** [\`uv\`](https://docs.astral.sh/uv/) - handles installing both **Python** builds and running the script, **no** virtualenv juggling needed
 
I originally wanted to use **Python 3.14**, which is the latest release. But when I tried to install the free-threaded build, \`uv\` hit a wall on my machine:
 
\`\`\`bash
error: No download found for request
\`\`\`
 
So I dropped back to **3.13**.
 
Install both builds with:
 
\`\`\`bash
uv python install cpython-3.13
uv python install cpython-3.13+freethreaded
\`\`\`

## The components


The script combines three things deliberately:
 
**[\`asyncio.gather\`](https://docs.python.org/3/library/asyncio-task.html#asyncio.gather)** - spawns all tasks concurrently from a single event loop.
 
**[\`asyncio.to_thread\`](https://docs.python.org/3/library/asyncio-task.html#asyncio.to_thread)** - dispatch a synchronous function onto a real OS thread from an async coroutine. Each task gets its own thread, which is where GIL contention actually happens.
 
**[\`asyncio.Semaphore\`](https://docs.python.org/3/library/asyncio-sync.html#asyncio.Semaphore)** - limits how many threads are doing work at the same time. Acquired in the async layer **before** the thread is spawned, so the event loop is the gatekeeper. If set to 10, at most 10 threads crunch numbers simultaneously.
 
The work itself is a pure CPU-bound busy loop - no I/O, no sleeping - because that's exactly the condition where the GIL hurts most.
 
## The script


\`\`\`python
# /// script
# requires-python = ">=3.13"
# dependencies = []
# ///

import asyncio
import threading
import time
from datetime import datetime, timezone

# config
TOTAL_TASKS = 1000 # asyncio tasks (and threads) to spawn
CONCURRENCY = 10 # max threads doing CPU work simultaneously
WORK_DURATION = 0.15 # seconds of CPU-bound work per thread

semaphore = asyncio.Semaphore(CONCURRENCY)
_active = 0
_lock = threading.Lock()

def ts() -> str:
    return datetime.now(timezone.utc).strftime("%H:%M:%S.%f")


def cpu_work(duration: float) -> int:
    """Pure CPU-bound busy loop - GIL contention shows up here."""
    end = time.perf_counter() + duration
    count = 0
    while time.perf_counter() < end:
        count += 1

def do_work(task_id: int) -> dict:
    """Runs inside a real OS thread - semaphore already acquired by the coroutine."""
    global _active
    with _lock:
        _active += 1
        print(f"... active={_active}")  # should never exceed CONCURRENCY
        assert _active <= CONCURRENCY, f"Semaphore broken! {_active} active"
    
    print(f"[{ts()}]  task {task_id} │ thread={threading.get_ident()} │ working")

    cpu_work(WORK_DURATION)
 
    print(f"[{ts()}]  task {task_id} │ thread={threading.get_ident()} │ done")

    with _lock:
        _active -= 1


async def worker(task_id: int) -> dict:
    """Waits for the asyncio semaphore, then dispatches work to a real OS thread."""
    print(f"[{ts()}]  task {task_id} │ waiting for semaphore")
 
    async with semaphore:
        return await asyncio.to_thread(do_work, task_id)


async def main() -> None:
    start = time.perf_counter()
    results = await asyncio.gather(*(worker(i) for i in range(1, TOTAL_TASKS + 1)))
    elapsed = time.perf_counter() - start
    print(f"Time elapsed: {elapsed:.1f}s")

if __name__ == "__main__":
    asyncio.run(main())
\`\`\`

A few things worth noting:
 
- The \`semaphore\` is global and created at module level - \`asyncio.Semaphore\` must be created in the same event loop it's used in, which \`asyncio.run()\` handles for us here.
- The \`_active\` counter and \`assert\` are there to **verify** the semaphore is actually working - if more than \`CONCURRENCY\` threads ever enter \`do_work\` simultaneously, the assert fires. It never did.
- \`asyncio.to_thread\` is the key: it keeps the event loop responsive while real threads do the heavy lifting.

Run it with:

- Standard CPython 3.13 - GIL ON
\`\`\`bash
uv run --python cpython-3.13 gil-benchmark/main.py
\`\`\`

- Free-threaded CPython 3.13 - GIL OFF
\`\`\`python
uv run --python cpython-3.13+freethreaded gil-benchmark/main.py
\`\`\`

## Results

| **Number of tasks** | **Elapsed time (with GIL)** | **Elapsed time (without GIL)** |
|---|---|---|
| 100 | 6.8s | 1.6s |
| 1000 | 67.9s | 15.4s |
| 10000 | 693.0s | 152.9s |
| **Semaphore held** | ✅ Never exceeded 10 | ✅ Never exceeded 10 |

## What I took away
 
The semaphore worked perfectly in both cases - the assert **never** fired, and the active counter **never** breached 10. That part is purely \`asyncio\` doing its job, GIL or not.
 
The elapsed time is where it gets interesting. With the GIL, threads take turns on the CPU even though the semaphore allows 10 at once - so each 150ms task ends up taking longer in practice. Without the GIL, those 10 threads genuinely run in parallel across cores.
 
It's a small script, but it makes something abstract very concrete: the GIL isn't a myth, and removing it has a real, measurable effect on CPU-bound threaded workloads. **Python 3.13**'s free-threaded build seems like something worth paying attention to.

## What I don't understand
 
### Are these async threads **actually** thread-safe?
 
This is something I kept poking at while writing this. \`asyncio\` is **not** thread-safe - it's designed to run on a **single** thread, and its primitives like \`asyncio.Semaphore\` are **not** safe to use across OS threads.
 
But the script works correctly, and here's why I think it does: the semaphore is always acquired inside the event loop (in the \`async with semaphore\` block) **before** \`asyncio.to_thread\` spawns the OS thread. By the time \`do_work\` runs in a real thread, the semaphore is already held. The thread never touches it. When \`do_work\` returns, control goes back to the event loop, which releases it. The asyncio and threading worlds never actually cross.
 
The moment you touch asyncio primitives from inside a thread - say, calling \`semaphore.release()\` from \`do_work\` - you're in undefined territory.
 
I still find the boundary between the two worlds a bit fuzzy in practice. If you have a cleaner mental model for this, I'd love to hear it.

*The full script is available on [GitHub](https://github.com/pyrsuit/scripts/blob/main/gil-benchmark/main.py). The test numbers will vary by machine.*
`;export{e as default};
