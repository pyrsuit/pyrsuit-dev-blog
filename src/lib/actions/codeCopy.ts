export function codeCopy(node: HTMLElement) {
  const blocks = node.querySelectorAll("pre > code");

  blocks.forEach((codeBlock) => {
    const codeParent = codeBlock.closest(".code-block");
    if (!codeParent) return;

    if (codeParent.querySelector(".copy-btn")) return;

    const button: HTMLButtonElement = document.createElement("button");
    button.textContent = "Copy";
    button.className =
      "copy-btn absolute top-2 right-2 text-xs bg-gray-200 px-2 py-1 rounded hover:bg-gray-300";

    codeParent.classList.add("relative");

    button.addEventListener("click", () => {
      const code = codeBlock.textContent ?? "";
      navigator.clipboard.writeText(code).then(() => {
        button.textContent = "Copied!";
        setTimeout(() => (button.textContent = "Copy"), 1000);
      });
    });

    codeParent.appendChild(button);
  });

  return {
    destroy() {
      node.querySelectorAll(".copy-btn").forEach((btn) => btn.remove());
    }
  };
}
