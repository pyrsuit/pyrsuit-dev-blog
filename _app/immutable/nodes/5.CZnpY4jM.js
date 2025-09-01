import"../chunks/Bzak7iHL.js";import"../chunks/CcL8L1UM.js";import{ai as P,f as h,a as u,aj as D,ak as e,al as a,am as p,g as d,an as A}from"../chunks/DK8D298C.js";import{s as y}from"../chunks/JY5l5D6Y.js";import{i as L}from"../chunks/DHz2Y3yU.js";import{e as C,i as M}from"../chunks/DLrSe-_4.js";import{d as g,r as N,h as S,a as W,c as R}from"../chunks/Dq1ptKLK.js";import{i as U}from"../chunks/CcjtmNi5.js";const f=[{title:"Walrus operator: assign on the fly 🛫",date:"2025-08-25",text:`I recently discovered that Python has a neat operator for assigning a value and using it immediately: the \`:=\` operator, also called the walrus operator.

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

💡 **Takeaway**: __[uv scripts](https://docs.astral.sh/uv/guides/scripts/)__ give you a disposable, isolated environment without any manual setup — ideal for clean, repeatable scripting without leaving a mess behind.`},{title:"Prometheus + multiprocess apps: A lesson from the trenches",date:"2025-07-13",text:"I recently deployed an API using `uWSGI` with multiple workers. I exposed a `/metrics` endpoint for `Prometheus` scraping — all looked good.\n\nUntil I realized… the metrics were off 🫠\n\nTurns out, when you're using multiple `uWSGI` workers, `Prometheus`' Python client needs **multiprocess mode** enabled to aggregate metrics across all worker processes. Without it, each process exposes its own separate metrics — so counters, for example, appear to jump up and down instead of increasing cumulatively across all workers. \n\n✅ **Fix:** Configured __[multiprocess mode](https://prometheus.github.io/client_python/multiprocess/)__, so all workers write metrics to a shared directory.\n\n💡 **Takeaway**: With multiple workers per replica, `Prometheus` scrapes the `/metrics` endpoint from only one worker per replica at random — so without multiprocess mode, your `Prometheus` metrics won't reflect the true state of your API — making it impossible to accurately track what's really happening."}];var j=h('<hr class="border-t border-gray-300 mt-6"/>'),F=h('<article><div class="flex items-baseline justify-between mb-2"><h1 class="text-2xl font-light tracking-tight"> </h1> <time class="text-sm text-gray-600 ml-4"> </time></div> <div class="markdown-content text-base text-gray-800 leading-relaxed"><!></div> <!></article>'),q=h('<section class="w-full max-w-5xl mx-auto px-6 pt-4 pb-16 space-y-8"></section>');function K(w,k){P(k,!1),g.use({renderer:N}),U();var i=q();C(i,5,()=>f,M,(v,o,_)=>{var s=F(),r=a(s),l=a(r),x=a(l,!0);e(l);var m=p(l,2),T=a(m,!0);e(m),e(r);var c=p(r,2),b=a(c);S(b,()=>g(d(o).text)),e(c);var I=p(c,2);{var E=t=>{var n=j();u(t,n)};L(I,t=>{_<f.length-1&&t(E)})}e(s),W(s,t=>{var n;return(n=R)==null?void 0:n(t)}),A(()=>{y(x,d(o).title),y(T,d(o).date)}),u(v,s)}),e(i),u(w,i),D()}export{K as component};
