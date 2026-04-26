import"../chunks/Bzak7iHL.js";import"../chunks/DORQWOit.js";import{ap as J,aq as A,ar as Y,f as p,a as c,as as H,t as e,aa as d,S as D,z as N,a8 as i,a9 as o,ab as g,Y as T,a0 as K}from"../chunks/CDsez_Gm.js";import{s as I}from"../chunks/Ciy5EP2b.js";import{i as _}from"../chunks/DoCYdl2-.js";import{e as V,i as X}from"../chunks/D0mMVKcf.js";import{d as L,r as Z,h as ee,a as te,c as ae}from"../chunks/BT5y1Oxm.js";import{s as M}from"../chunks/CK7KUTJ6.js";import{i as ne}from"../chunks/DHXagj1S.js";import{s as re,a as se}from"../chunks/CWjPdQEG.js";import{p as ie}from"../chunks/DLHmOI_U.js";const S=[{title:'"Compile me!" 🫖',date:"October 8, 2025",text:`Deciding whether to \`re.compile\` a **regex** is a bit like Alice pondering the bottle labeled *“Drink me!”* - it's about picking the best option for the situation.

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

💡 **Takeaway**: For repeated use, compile your regex - otherwise it'll end up like the white rabbit, frantically rushing: *"Oh dear, oh dear, I shall be late — I got a match!"*`},{title:"Non-public 🚫 vs protected 🛡️",date:"September 27, 2025",text:`⚠️ **Disclaimer**: If you're coming from an OOP background, you may find the following content disturbing. Read at your own risk.

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

💡 **Takeaway**: Use **single** underscore for helpers or temporary state, **double** underscore for critical storage that shouldn't be accidentally overridden.`},{title:"Walrus operator: assign on the fly 🛫",date:"August 25, 2025",text:`I recently discovered that Python has a neat operator for assigning a value and using it immediately: the \`:=\` operator, also called the walrus operator.

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

💡 **Takeaway**: \`:=\` = assign inline, use instantly, keep it neat.`},{title:"The one when TRUNCATE locked me out 🚪🔒",date:"August 19, 2025",text:"While running `pytest` with `MySQL`, I kept hitting tests stuck on: `Waiting for table metadata lock` 😫 \n\nDigging in, I found the culprit: my fixtures were using `TRUNCATE TABLE` to clean test data between runs. \n\nHere's the catch: In MySQL, `TRUNCATE` is __[DDL](https://en.wikipedia.org/wiki/Data_definition_language)__, not __[DML](https://en.wikipedia.org/wiki/Data_manipulation_language)__. It drops/recreates the table under the hood, resets `AUTO_INCREMENT`, and requires an **exclusive metadata lock**. If any transaction has touched the table — even just a `SELECT` — `TRUNCATE` will block until that lock is released. In `pytest`, with long-lived connections, this happened constantly. \n\n✅ **Fix:** switched to `DELETE FROM` table for cleanup. `DELETE` is `DML`, transactional, and only takes row locks + short metadata locks. It doesn't reset `AUTO_INCREMENT`, but it doesn't block other transactions either. \n\n💡 **Takeaway:**: In `MySQL` tests, prefer `DELETE` over TRUNCATE unless you can guarantee no open transactions. \n\n🔄 **Postgres comparison**: `TRUNCATE` in `Postgres` is transactional — you can roll it back, and it doesn't block in the same way. It still takes stricter locks than `DELETE`, but because `Postgres` metadata locking is less rigid, it rarely causes the same “hung DDL” issues you see in `MySQL`."},{title:"When metrics eat your memory 🧠 🍽️",date:"July 24, 2025",text:`Follow-up to my earlier post on Prometheus + Multiprocess Apps ... 

A few days in, I noticed the metrics directory was ballooning in memory 🎈 

Digging in, I realized the Prometheus Python client (in multiprocess mode) writes separate files per metric per process. By default, those files are named things like \`counter_12345.db\`, where \`12345\` is the PID.

So when a \`uWSGI\` worker dies and gets replaced — totally normal behavior — the new process gets its own set of metric files. But the old files? They just stay there.

Since the client doesn’t automatically clean up stale files, the directory just keeps growing.

✅ Fix: I configured a cleanup step to remove metrics for dead processes.

💡 Takeaway: In multiprocess mode, the metrics client tracks data per PID. Without cleanup, these files accumulate and quietly consume memory — especially in environments with frequent process restarts.`},{title:"Goodbye temp venv hacks 👋",date:"July 19, 2025",text:`Today I learned how much I enjoy using \`uv\` scripts for quick, one-off tasks.

You can define dependencies right at the top of the script, and when you run it with \`uv\`, it spins up a temporary virtual environment automatically. Once the script finishes, the environment is destroyed — super clean 🧹

This is perfect for things like initial tasks when starting a container, or scripts that import data, run a migration, or do any kind of setup that isn't needed once the main app is running.

💡 **Takeaway**: __[uv scripts](https://docs.astral.sh/uv/guides/scripts/)__ give you a disposable, isolated environment without any manual setup — ideal for clean, repeatable scripting without leaving a mess behind.`},{title:"Prometheus + multiprocess apps: A lesson from the trenches",date:"July 13, 2025-",text:"I recently deployed an API using `uWSGI` with multiple workers. I exposed a `/metrics` endpoint for `Prometheus` scraping — all looked good.\n\nUntil I realized… the metrics were off 🫠\n\nTurns out, when you're using multiple `uWSGI` workers, `Prometheus`' Python client needs **multiprocess mode** enabled to aggregate metrics across all worker processes. Without it, each process exposes its own separate metrics — so counters, for example, appear to jump up and down instead of increasing cumulatively across all workers. \n\n✅ **Fix:** Configured __[multiprocess mode](https://prometheus.github.io/client_python/multiprocess/)__, so all workers write metrics to a shared directory.\n\n💡 **Takeaway**: With multiple workers per replica, `Prometheus` scrapes the `/metrics` endpoint from only one worker per replica at random — so without multiprocess mode, your `Prometheus` metrics won't reflect the true state of your API — making it impossible to accurately track what's really happening."}];var oe=p('<a class="font-extralight text-sm">← prev</a>'),le=p('<a class="font-extralight text-sm">next →</a>'),ce=p('<div class="flex items-center justify-end gap-6 pb-2"><!> <span class="font-extralight text-sm text-gray-500"> </span> <!></div>'),de=p('<hr class="border-t border-gray-300 mt-6"/>'),pe=p('<article><div class="flex items-baseline justify-between mb-2"><h1 class="text-2xl font-light tracking-tight"> </h1> <time class="text-sm text-gray-600 ml-4"> </time></div> <div class="markdown-content text-base text-gray-800 leading-relaxed"><!></div> <!></article>'),ue=p('<a class="font-extralight text-sm">← prev</a>'),me=p('<a class="font-extralight text-sm">next →</a>'),he=p('<div class="flex items-center justify-end gap-6 pt-4"><!> <span class="font-extralight text-sm text-gray-500"> </span> <!></div>'),fe=p('<section class="w-full max-w-5xl mx-auto px-6 pt-4 pb-16 space-y-8"><!> <!> <!></section>');function Ee(W,F){J(F,!1);const[O,U]=re(),$=()=>se(ie,"$page",O),r=N(),w=N(),x=N();L.use({renderer:Z});const E=5,m=Math.ceil(S.length/E);A(()=>$(),()=>{D(r,Math.max(1,Math.min(parseInt($().url.searchParams.get("page")||"1"),m)))}),A(()=>e(r),()=>{D(w,(e(r)-1)*E)}),A(()=>e(w),()=>{D(x,S.slice(e(w),e(w)+E))}),Y(),ne();var P=fe(),R=i(P);{var j=l=>{var n=ce(),h=i(n);{var u=t=>{var a=oe();g(()=>M(a,"href",`?page=${e(r)-1}`)),c(t,a)};_(h,t=>{e(r)>1&&t(u)})}var s=d(h,2),f=i(s);o(s);var v=d(s,2);{var y=t=>{var a=le();g(()=>M(a,"href",`?page=${e(r)+1}`)),c(t,a)};_(v,t=>{e(r)<m&&t(y)})}o(n),g(()=>I(f,`${e(r)??""} / ${m}`)),c(l,n)};_(R,l=>{m>1&&l(j)})}var C=d(R,2);V(C,1,()=>e(x),X,(l,n,h)=>{var u=pe(),s=i(u),f=i(s),v=i(f,!0);o(f);var y=d(f,2),t=i(y,!0);o(y),o(s);var a=d(s,2),G=i(a);ee(G,()=>(K(L),e(n),T(()=>L(e(n).text)))),o(a);var Q=d(a,2);{var z=b=>{var k=de();c(b,k)};_(Q,b=>{e(x),T(()=>h<e(x).length-1)&&b(z)})}o(u),te(u,b=>{var k;return(k=ae)==null?void 0:k(b)}),g(()=>{I(v,(e(n),T(()=>e(n).title))),I(t,(e(n),T(()=>e(n).date)))}),c(l,u)});var q=d(C,2);{var B=l=>{var n=he(),h=i(n);{var u=t=>{var a=ue();g(()=>M(a,"href",`?page=${e(r)-1}`)),c(t,a)};_(h,t=>{e(r)>1&&t(u)})}var s=d(h,2),f=i(s);o(s);var v=d(s,2);{var y=t=>{var a=me();g(()=>M(a,"href",`?page=${e(r)+1}`)),c(t,a)};_(v,t=>{e(r)<m&&t(y)})}o(n),g(()=>I(f,`${e(r)??""} / ${m}`)),c(l,n)};_(q,l=>{m>1&&l(B)})}o(P),c(W,P),H(),U()}export{Ee as component};
