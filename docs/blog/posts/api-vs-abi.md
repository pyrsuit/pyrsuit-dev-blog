---
date: 2026-07-16
slug: api-vs-abi
tags:
  - TIL
  - Packaging
---

# API vs ABI 🧩

Ever installed a compiled **Python** package and hit a segfault instead of a nice traceback? 🫠

<!-- more -->

That's the **ABI**.

An **API** defines how code talks to code at the **source** level:

- function names,
- signatures,
- what you `import` and call.

An **ABI** (Application Binary Interface) defines how **already-compiled** code talks to other compiled code:

- how structs are laid out in memory,
- how arguments get passed,
- how objects are reference-counted.

**CPython** has its own ABI, and its internal structs (like __[`PyObject`](https://docs.python.org/3/c-api/structures.html#c.PyObject)__) can shift shape between **minor** versions - which is why a C extension built for **Python** `3.11` often can't be used in `3.12` without a rebuild.

**Why this matters if you build or ship packages** 🛠️

🔁 By default, compiled extensions need to be rebuilt per **Python** version - unless you opt into the **limited API** / **stable ABI** via `Py_LIMITED_API`, trading some features for `abi3` wheels that work across versions (__[PEP 384](https://peps.python.org/pep-0384/)__).

🏷️ Wheel tags like `cp311-cp311` vs `cp311-abi3` literally spell out which ABI contract the binary is promising to honor.

💥 If you get the ABI wrong, users don't get a friendly **Python** exception.

📚 For a proper deep dive, check out this __[article on the **Python** ABI and abi3t](https://labs.quansight.org/blog/python-abi-abi3t)__ - it covers the free-threaded build and what `abi3t` means for the stable ABI going forward.

💡 **Takeaway**: If you distribute C extensions, rebuild per **Python** version or use `abi3` - otherwise the ABI will break in a segfault, not an exception.
