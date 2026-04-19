import { marked } from 'marked';
import hljs from 'highlight.js';

export const renderer = {
  code({ text, lang }: { text: string; lang?: string }) {
    if (lang === 'mermaid') {
      return `<div class="mermaid">${text}</div>`;
    }
    const languageLabel = lang ?? 'text';
    const highlighted =
      lang && hljs.getLanguage(lang)
        ? hljs.highlight(text, { language: lang }).value
        : hljs.highlightAuto(text).value;

    return `
      <div class="code-block">
        <small class="language-label">${languageLabel}</small>
        <pre><code class="hljs language-${languageLabel}">${highlighted}</code></pre>
      </div>
    `;
  }
};
