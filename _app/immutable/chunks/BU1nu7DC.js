const e=`<div class="flex items-baseline justify-between mb-2">
  <h1 class="text-2xl font-light tracking-tight">A training cycle planning agent</h1>
  <time class="text-sm text-gray-600 ml-4">July 5, 2026</time>
</div>

> *An agent that turns office days, a workout split, and menstrual cycle phase into a scheduled week - exportable straight to a calendar.*

## How it works

\`\`\`mermaid
graph LR
    A[CLI prompts] --> B[WeekInput]
    B --> C[Pydantic AI Agent]
    C --> D[WeekPlan]
    D --> E[CLI output]
    D --> F[.ics export]
\`\`\`

You answer a few prompts - office days, long office days, how many strength/climbing/running/yoga sessions you want, rest days, cycle phase, and add any notes. Then the agent returns a day-by-day plan with intensity levels and a load summary, optionally exported to your calendar. Built for ladies who take their climbing sends as seriously as their sprint commitments.

## The components

**\`WeekInput\`** bundles the week's constraints: 
- \`office_days\`, 
- \`long_days\` (workdays that run until 7pm), 
- a \`WorkoutSplit\` across strength, climbing, running, yoga and "random", 
- the current \`CyclePhase\`,
- and free-text notes.

**The system prompt** (\`prompts.py\`) is where the actual planning logic lives:
- describes training load guidance per cycle phase,
- defines commute and time constraints on office days,
- sets placement rules, e.g. never two high-intensity days back to back, or recovery instructions.

**\`WeekPlan\`** is the structured output, and is enforced with Pydantic AI's native [\`Output\`](https://ai.pydantic.dev/output/) model - it contains \`ScheduledActivity\` entries (activity, intensity, optional start time, notes) plus a summary and an overall load assessment.

**\`gemma4:e2b\`** runs locally through \`Ollama\`, the same setup as the [meal planner](https://pyrsuit.dev/lab/local_shopping_agent) agent: \`OllamaProvider\` pointed at the OpenAI-compatible \`/v1\` endpoint.

**\`calendar_sync.py\`** exports the plan to \`.ics\` via the [icalendar](https://icalendar.readthedocs.io/en/stable/) package, so the week goes straight from terminal to calendar app.

## The experience

Compared to the *meal planner*, the output here is **genuinely good**, I couldn't have planned better myself. It also never hit the malformed-output retries the *meal planner* occasionally ran into, the \`Output\` came back **valid** every time. That's likely just because these instructions are much more precise than the *meal planner*'s.

## What I learned

It is interesting that classic software design pushes toward **abstraction**: generalize early, keep things broadly applicable. Agent design pulls the other way: the **more specific** the instructions, the **better** the agent performs.

It's also encouraging that a rather highly specialized agent like this runs fine on modest hardware - I use the same 16 GB unified-memory machine from the [qwen2.5-coder setup](https://pyrsuit.dev/lab/qwen2_coder_local_setup). Watching resource usage while it ran: **memory** peaked around **7.5 GB** and all **8 CPU cores** were busy.

You can find the repo and usage instructions on [GitHub](https://github.com/pyrsuit/week-planner-agent).
`;export{e as default};
