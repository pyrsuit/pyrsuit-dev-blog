import { marked } from 'marked';

export const renderer = {
  code({ text, lang }: { text: string; lang?: string }) {
    if (lang === 'mermaid') {
      return `<div class="mermaid">${text}</div>`;
    }
    const languageLabel = lang ?? 'text';

    return `
      <div class="code-block">
        <small class="language-label">${languageLabel}</small>
        <pre><code class="language-${languageLabel}">${text}</code></pre>
      </div>
    `;
  }
};
