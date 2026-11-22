---
date: 2025-08-25
slug: walrus-operator-assign-on-the-fly
tags:
  - TIL
  - Language features
---

# Walrus operator: assign on the fly 🛫

I recently discovered that Python has a neat operator for assigning a value and using it immediately: the `:=` operator, also called the walrus operator.

<!-- more -->

For example, instead of:

```python
value = data.get("key")
if value:
    print(len(value))
```

You can do:

```python
if (value := data.get("key")):
    print(len(value))
```

Boom 💥 value is assigned and ready to roll.

💡 **Takeaway**: `:=` = assign inline, use instantly, keep it neat.
