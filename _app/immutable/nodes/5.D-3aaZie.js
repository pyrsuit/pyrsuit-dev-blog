import"../chunks/Bzak7iHL.js";import"../chunks/CcL8L1UM.js";import{ai as E,f as p,a as d,aj as A,ak as e,al as n,am as u,g as m,an as P}from"../chunks/DK8D298C.js";import{s as f}from"../chunks/JY5l5D6Y.js";import{i as D}from"../chunks/DHz2Y3yU.js";import{e as N,i as L}from"../chunks/DLrSe-_4.js";import{d as g,r as C,h as R,a as W,c as F}from"../chunks/Dq1ptKLK.js";import{i as S}from"../chunks/CcjtmNi5.js";const y=[{title:'"Compile me!" 🫖',date:"2025-10-03",text:`Deciding whether to \`re.compile\` a **regex** is a bit like Alice pondering the bottle labeled *“Drink me!”* - it's about picking the best option for the situation.

- **One-off search**: A small sip with minimal effect and negligible overhead. If you only plan to run the **regex** once, there's no benefit to compiling it - **Python** will take care of that automatically when \`re.search\` is invoked.

\`\`\`python
import re

if re.search(r"\\bwhite\\s+rabbit\\b", "Alice chased the white rabbit into the hole."):
    print("Found the white rabbit!")
\`\`\`

- **Repeated use:** A generous sip with a noticeable impact. Each call to \`re.search\` inside a loop would recompile the **regex**, creating overhead. When compiling the pattern once, multiple searches can reuse it and save time.

\`\`\`python
import re

texts = [
    "Alice quickly ran after the white rabbit as it disappeared behind the bushes.",
    "The white rabbit looked at its pocket watch anxiously before hopping away."
]

pattern = re.compile(r"\\bwhite\\s+rabbit\\b")

for text in texts:
    if pattern.search(text):
        print("Found the white rabbit!")
\`\`\`

✅ Reuse → compile.
❌ One-off → skip it.

💡 **Takeaway**: For repeated use, compile your regex - otherwise it'll end up like the white rabbit, frantically rushing: *"Oh dear, oh dear, I shall be late — I got a match!"*`},{title:"Non-public 🚫 vs protected 🛡️",date:"2025-09-27",text:`⚠️ **Disclaimer**: If you're coming from an OOP background, you may find the following content disturbing. Read at your own risk.

**Python** doesn't do strict access control, a single underscore means **private by convention**, while a double underscore triggers **name mangling** to protect attributes from being accidentally overridden in subclasses.

But what happens if a subclass defines its own double underscore attribute? How does a single-underscore variable differ from a double underscore variable in practice?

For example, the base \`Metric\` class has \`__storage\` and a \`_mean\`:

\`\`\`python
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
\`\`\`

A subclass can define its own double underscore attribute without overwriting the parent:

\`\`\`python
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
\`\`\`

💡 **Takeaway**: Use **single** underscore for helpers or temporary state, **double** underscore for critical storage that shouldn't be accidentally overridden.`},{title:"Walrus operator: assign on the fly 🛫",date:"2025-08-25",text:`I recently discovered that Python has a neat operator for assigning a value and using it immediately: the \`:=\` operator, also called the walrus operator.

For example, instead of:

\`\`\`python
value = data.get("key")
if value:
    print(len(value))
\`\`\`

You can do:

\`\`\`python
if (value := data.get("key")):
    print(len(value))
\`\`\`

Boom 💥 value is assigned and ready to roll.

💡 **Takeaway**: \`:=\` = assign inline, use instantly, keep it neat.`},{title:"The one when TRUNCATE locked me out 🚪🔒",date:"2025-08-19",text:"While running `pytest` with `MySQL`, I kept hitting tests stuck on: `Waiting for table metadata lock` 😫 \n\nDigging in, I found the culprit: my fixtures were using `TRUNCATE TABLE` to clean test data between runs. \n\nHere's the catch: In MySQL, `TRUNCATE` is __[DDL](https://en.wikipedia.org/wiki/Data_definition_language)__, not __[DML](https://en.wikipedia.org/wiki/Data_manipulation_language)__. It drops/recreates the table under the hood, resets `AUTO_INCREMENT`, and requires an **exclusive metadata lock**. If any transaction has touched the table — even just a `SELECT` — `TRUNCATE` will block until that lock is released. In `pytest`, with long-lived connections, this happened constantly. \n\n✅ **Fix:** switched to `DELETE FROM` table for cleanup. `DELETE` is `DML`, transactional, and only takes row locks + short metadata locks. It doesn't reset `AUTO_INCREMENT`, but it doesn't block other transactions either. \n\n💡 **Takeaway:**: In `MySQL` tests, prefer `DELETE` over TRUNCATE unless you can guarantee no open transactions. \n\n🔄 **Postgres comparison**: `TRUNCATE` in `Postgres` is transactional — you can roll it back, and it doesn't block in the same way. It still takes stricter locks than `DELETE`, but because `Postgres` metadata locking is less rigid, it rarely causes the same “hung DDL” issues you see in `MySQL`."},{title:"When metrics eat your memory 🧠 🍽️",date:"2025-07-24",text:`Follow-up to my earlier post on Prometheus + Multiprocess Apps ... 

A few days in, I noticed the metrics directory was ballooning in memory 🎈 

Digging in, I realized the Prometheus Python client (in multiprocess mode) writes separate files per metric per process. By default, those files are named things like \`counter_12345.db\`, where \`12345\` is the PID.

So when a \`uWSGI\` worker dies and gets replaced — totally normal behavior — the new process gets its own set of metric files. But the old files? They just stay there.

Since the client doesn’t automatically clean up stale files, the directory just keeps growing.

✅ Fix: I configured a cleanup step to remove metrics for dead processes.

💡 Takeaway: In multiprocess mode, the metrics client tracks data per PID. Without cleanup, these files accumulate and quietly consume memory — especially in environments with frequent process restarts.`},{title:"Goodbye temp venv hacks 👋",date:"2025-07-19",text:`Today I learned how much I enjoy using \`uv\` scripts for quick, one-off tasks.

You can define dependencies right at the top of the script, and when you run it with \`uv\`, it spins up a temporary virtual environment automatically. Once the script finishes, the environment is destroyed — super clean 🧹

This is perfect for things like initial tasks when starting a container, or scripts that import data, run a migration, or do any kind of setup that isn't needed once the main app is running.

💡 **Takeaway**: __[uv scripts](https://docs.astral.sh/uv/guides/scripts/)__ give you a disposable, isolated environment without any manual setup — ideal for clean, repeatable scripting without leaving a mess behind.`},{title:"Prometheus + multiprocess apps: A lesson from the trenches",date:"2025-07-13",text:"I recently deployed an API using `uWSGI` with multiple workers. I exposed a `/metrics` endpoint for `Prometheus` scraping — all looked good.\n\nUntil I realized… the metrics were off 🫠\n\nTurns out, when you're using multiple `uWSGI` workers, `Prometheus`' Python client needs **multiprocess mode** enabled to aggregate metrics across all worker processes. Without it, each process exposes its own separate metrics — so counters, for example, appear to jump up and down instead of increasing cumulatively across all workers. \n\n✅ **Fix:** Configured __[multiprocess mode](https://prometheus.github.io/client_python/multiprocess/)__, so all workers write metrics to a shared directory.\n\n💡 **Takeaway**: With multiple workers per replica, `Prometheus` scrapes the `/metrics` endpoint from only one worker per replica at random — so without multiprocess mode, your `Prometheus` metrics won't reflect the true state of your API — making it impossible to accurately track what's really happening."}];var U=p('<hr class="border-t border-gray-300 mt-6"/>'),O=p('<article><div class="flex items-baseline justify-between mb-2"><h1 class="text-2xl font-light tracking-tight"> </h1> <time class="text-sm text-gray-600 ml-4"> </time></div> <div class="markdown-content text-base text-gray-800 leading-relaxed"><!></div> <!></article>'),j=p('<section class="w-full max-w-5xl mx-auto px-6 pt-4 pb-16 space-y-8"></section>');function K(_,b){E(b,!1),g.use({renderer:C}),S();var s=j();N(s,5,()=>y,L,(w,r,k)=>{var a=O(),o=n(a),l=n(o),v=n(l,!0);e(l);var h=u(l,2),x=n(h,!0);e(h),e(o);var c=u(o,2),T=n(c);R(T,()=>g(m(r).text)),e(c);var I=u(c,2);{var M=t=>{var i=U();d(t,i)};D(I,t=>{k<y.length-1&&t(M)})}e(a),W(a,t=>{var i;return(i=F)==null?void 0:i(t)}),P(()=>{f(v,m(r).title),f(x,m(r).date)}),d(w,a)}),e(s),d(_,s),A()}export{K as component};
