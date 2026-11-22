---
date: 2025-09-27
slug: non-public-vs-protected
tags:
  - TIL
  - Language features
---

# Non-public 🚫 vs protected 🛡️

⚠️ **Disclaimer**: If you're coming from an OOP background, you may find the following content disturbing. Read at your own risk.

<!-- more -->

**Python** doesn't do strict access control, a single underscore means **private by convention**, while a double underscore triggers **name mangling** to protect attributes from being accidentally overridden in subclasses.

But what happens if a subclass defines its own double underscore attribute? How does a single-underscore variable differ from a double underscore variable in practice?

For example, the base `Metric` class has `__storage` and a `_mean`:

```python
class Metric:
    def __init__(self):
        self.__storage = []  # double underscore → protected
        self._mean = None  # single underscore → private

    def add(self, num):
        self.__storage.append(num)
        self._mean = None

    def mean(self):
        if self._mean is None:
            self._mean = sum(self.__storage) / len(self.__storage)
        return self._mean

m = Metric()
m.add(5)
m.add(8)
print("Metric mean:", m.mean())  # 6.5
print("Metric __dict__:", m.__dict__)  # {'_Metric__storage': [5, 8], '_mean': 6.5}
```

A subclass can define its own double underscore attribute without overwriting the parent:

```python
class MaxMetric(Metric):
    def __init__(self):
        super().__init__()
        self.__storage = None  # subclass storage, mangled separately

    def add(self, num):
        super().add(num)
        if self.__storage is None or num > self.__storage:
            self.__storage = num

    def max(self):
        return self.__storage

mm = MaxMetric()
mm.add(3)
mm.add(10)
mm.add(7)
print("MaxMetric mean:", mm.mean())  # 6.666666666666667
print("MaxMetric max:", mm.max())  # 10
print("MaxMetric __dict__:", mm.__dict__)
# {'_Metric__storage': [3, 10, 7], '_mean': 6.666666666666667, '_MaxMetric__storage': 10}
```

💡 **Takeaway**: Use **single** underscore for helpers or temporary state, **double** underscore for critical storage that shouldn't be accidentally overridden.
