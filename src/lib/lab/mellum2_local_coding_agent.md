<div class="flex items-baseline justify-between mb-2">
  <h1 class="text-2xl font-light tracking-tight">A local coding agent with Mellum2</h1>
  <time class="text-sm text-gray-600 ml-4">August 1, 2026</time>
</div>

> *A follow-up to [running qwen2.5-coder locally](https://pyrsuit.dev/lab/qwen2_coder_local_setup). That one ended with an open question: is there a model that fits in 16 GB of unified memory and can still handle small agentic tasks? Here's the answer.*

## Recap

`qwen2.5-coder:7b` on a 16 GB unified-memory machine could **print** a tool call, but it couldn't actually **call** the tool. Asked to list files, it wrote out what a tool call would look like instead of invoking one. The obvious next question was whether that was [OpenCode](https://opencode.ai)'s fault or the model on the current machine. So I tried a second agent.

## Agent or model?

I added **[Pi](https://pi.dev)** as a second coding agent pointed at the exact same local Ollama. Same failure mode: asked to create a file, Pi also got the tool call back as plain chat text instead of an executable call.

Qwen2.5-Coder is supposed to wrap tool calls in `<tool_call></tool_call>` tags so Ollama's OpenAI-compatible endpoint can parse them into a structured `tool_calls` response. The `7b` build I could fit in 16 GB doesn't reliably do this, so Ollama falls back to returning plain text, and the agent has nothing to execute.

That's a claim about **this** setup, not about Qwen2.5-Coder in general; a larger build on roomier hardware may well behave differently.

## Switching to Mellum2

Swapping the local model for JetBrains' **[Mellum2 Instruct — Q4_K_M](https://ollama.com/JetBrains/mellum2-instruct-q4_k_m)** opens the door to more experimentation.

Unlike the Qwen model, Mellum2 reliably emits structured tool calls, so Ollama parses them into a real tool calls instead of falling back to text. In practice the agent finally **does** things rather than describing them:

- **Listing files**: it invokes the tool and shows the directory contents.
- **Creating files**: asked to create a file, it runs the tool and the file appears on disk.
- **Higher-level instructions**: asked to create `Pydantic` models, it writes working model classes to a file.

## But is the code any good?

Tool-calling working is one thing; writing correct code is another. To measure that I ran **[EvalPlus](https://github.com/evalplus/evalplus)**, which scores functional correctness on **[HumanEval+](https://github.com/openai/human-eval)**, 164 hand-written problems from OpenAI, each a function signature plus a docstring the model has to fill in. The `+` adds many extra test cases. `pass@1` is the fraction solved correctly on the first (and only) attempt.

Everything runs in containers: the `evalplus` service shares the Compose network with Ollama. The model-generated code is **executed inside a sandboxed container**, never on the host.

The result, on a 16 GB machine with no dedicated VRAM:

```
humaneval (base tests)
pass@1: 0.872
humaneval+ (base + extra tests)
pass@1: 0.848
```

**87.2%** on the base tests, and it only drops to **84.8%** under **EvalPlus**'s tougher extra tests, a small gap, which suggests the passing solutions are genuinely correct rather than overfit to the original cases.

All the commands and step-by-step instructions to reproduce this (Docker Compose, agent configs, and the EvalPlus profile) are in the [repo's README](https://github.com/pyrsuit/qwen2.5-coder-local-setup). Issues and PRs with other models that fit the budget are welcome.
