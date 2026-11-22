---
date: 2025-10-08
slug: compile-me
tags:
  - TIL
  - Language features
  - Performance
---

# "Compile me!" 🫖

Deciding whether to `re.compile` a **regex** is a bit like Alice pondering the bottle labeled *“Drink me!”* - it's about picking the best option for the situation.

<!-- more -->

- **One-off search**: A small sip with minimal effect and negligible overhead. If you only plan to run the **regex** once, there's no benefit to compiling it - **Python** will take care of that automatically when `re.search` is invoked.

```python
import re

if re.search(r"\bwhite\s+rabbit\b", "Alice chased the white rabbit into the hole."):
    print("Found the white rabbit!")
```

- **Repeated use:** A generous sip with a noticeable impact. Each call to `re.search` inside a loop would recompile the **regex**, creating overhead. When compiling the pattern once, multiple searches can reuse it and save time.

```python
import re

texts = [
    "Alice quickly ran after the white rabbit as it disappeared behind the bushes.",
    "The white rabbit looked at its pocket watch anxiously before hopping away."
]

pattern = re.compile(r"\bwhite\s+rabbit\b")

for text in texts:
    if pattern.search(text):
        print("Found the white rabbit!")
```

✅ Reuse → compile.
❌ One-off → skip it.

💡 **Takeaway**: For repeated use, compile your regex - otherwise it'll end up like the white rabbit, frantically rushing: *"Oh dear, oh dear, I shall be late — I got a match!"*
