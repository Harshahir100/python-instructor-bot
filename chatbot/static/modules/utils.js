/**
 * Utilities & Configuration
 * Markdown config, rendering helpers, and text formatting
 */

// Markdown configuration
marked.setOptions({
  breaks: true,
  gfm: true,
  langPrefix: "language-",
  highlight: function (code, lang) {
    if (lang && hljs.getLanguage(lang)) {
      return hljs.highlight(code, { language: lang }).value;
    }
    return hljs.highlightAuto(code).value;
  },
});

// Render markdown + highlight code
function renderMarkdown(el, text) {
  el.innerHTML = marked.parse(text);

  el.querySelectorAll("pre code").forEach((block) => {
    if (!block.className.includes("language-")) {
      block.classList.add("language-python"); // fallback
    }
    hljs.highlightElement(block);
  });
}

// Type text character by character
function typeText(el, text, speed = 6) {
  el.innerHTML = "";
  let i = 0;

  function type() {
    if (i < text.length) {
      el.innerHTML += text[i++];
      setTimeout(type, speed);
    } else {
      el.innerHTML = marked.parse(text);
      el.querySelectorAll("pre code").forEach((code) => {
        hljs.highlightElement(code);
      });
    }
  }
  type();
}

// Auto-detect Python code blocks
function forcePythonCodeBlocks(text) {
  // If code blocks already exist, do nothing
  if (text.includes("```")) return text;

  // Detect Python-like code lines
  const codePattern =
    /(from\s+\w+|import\s+\w+|def\s+\w+|class\s+\w+|for\s+\w+|while\s+|if\s+__name__|print\()/;

  const lines = text.split("\n");
  let hasCode = lines.some((line) => codePattern.test(line));

  if (!hasCode) return text;

  return "```python\n" + text + "\n```";
}
