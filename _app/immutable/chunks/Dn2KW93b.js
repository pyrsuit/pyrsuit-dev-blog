const e=`<div class="flex items-baseline justify-between mb-2">
  <h1 class="text-2xl font-light tracking-tight">A local coding agent with qwen2.5-coder and Ollama</h1>
  <time class="text-sm text-gray-600 ml-4">July 5, 2026</time>
</div>

> *Trying to run [qwen2.5-coder](https://ollama.com/library/qwen2.5-coder/tags) as a coding agent on a machine with 16 GB of unified memory, no dedicated VRAM.*

## The setup

\`\`\`mermaid
graph LR
    A[OpenCode] --> B[Ollama in Docker]
    B --> C[qwen2.5-coder:7b]
\`\`\`

\`Ollama\` runs in a plain Docker container, no GPU passthrough needed since the machine has unified memory shared between CPU and GPU rather than dedicated VRAM:

\`\`\`yaml
services:
  ollama:
    image: ollama/ollama
    container_name: ollama-qwen-coder
    ports:
      - "11434:11434"
    volumes:
      - ollama_data:/root/.ollama
\`\`\`

Once it's up, the model gets pulled into the running container:

\`\`\`bash
docker exec -it ollama-qwen-coder ollama pull qwen2.5-coder:7b
\`\`\`

**[OpenCode](https://opencode.ai)** is the coding agent. It talks to \`Ollama\`'s OpenAI-compatible \`/v1\` endpoint, configured as just another provider:

\`\`\`json
{
  "provider": {
    "ollama": {
      "npm": "@ai-sdk/openai-compatible",
      "options": { "baseURL": "http://localhost:11434/v1" },
      "models": {
        "qwen2.5-coder:7b": { "tools": true }
      }
    }
  }
}
\`\`\`

## Why the tag matters

On a 16 GB unified-memory machine, there's no separate VRAM budget - model, context, and everything else the OS needs compete for the same pool. The [tag list](https://ollama.com/library/qwen2.5-coder/tags) spans from \`0.5b\` to \`32b\`, and picking the wrong one is the difference between "runs" and "runs usably."

## The experience

\`7b\` was too small to be a coding agent. Asked to list the files in a directory, it didn't call the tool - it printed out what a tool call would look like:

\`\`\`
{"name": "glob", "arguments": {"pattern": "*"}}
\`\`\`

Instead of invoking \`glob\` through the API, it just wrote the JSON as text and stopped there.

I'd genuinely like to know if there's a model that fits in 16 GB of unified memory and can still handle small agentic tasks. The [repo](https://github.com/pyrsuit/qwen2-coder-local-setup) is open for issues or PRs with your suggestions.
`;export{e as default};
