function send(convoId) {
  const input = document.getElementById("input");
  const msg = input.value.trim();
  if (!msg) return;

  const messages = document.getElementById("messages");

  messages.innerHTML += `<div class="user">${msg}</div>`;

  const bot = document.createElement("div");
  bot.className = "bot";
  bot.textContent = "";     // 🔥 plain text while streaming
  messages.appendChild(bot);

  fetch(`/chat/${convoId}/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message: msg })
  }).then(async res => {
    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let full = "";

    // STREAM → TEXT ONLY
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      full += decoder.decode(value, { stream: true });
      bot.textContent = full;
      messages.scrollTop = messages.scrollHeight;
    }

    // 🔥 FINAL MARKDOWN RENDER
    bot.innerHTML = marked.parse(full);

    // 🔥 HIGHLIGHT CODE BLOCKS
    bot.querySelectorAll("pre code").forEach(block => {
      hljs.highlightElement(block);
    });
  });

  input.value = "";
}

function typeText(el, text, speed = 6) {
  el.innerHTML = "";
  let i = 0;

  function type() {
    if (i < text.length) {
      el.innerHTML += text[i++];
      setTimeout(type, speed);
    } else {
      el.innerHTML = marked.parse(text);
      el.querySelectorAll("pre code").forEach(code => {
        hljs.highlightElement(code);
      });
    }
  }
  type();
}

// Create new chat
function newChat() {
  fetch("/new-chat/")
    .then(r => r.json())
    .then(d => location.href = `/?c=${d.id}`);
}


// Delete single chat
function deleteChat(id) {
  fetch(`/delete/${id}/`)
    .then(() => location.reload());
}


// Delete all chats
function deleteAll() {
  if (confirm("Delete all conversations?")) {
    fetch("/delete-all/")
      .then(() => location.reload());
  }
}


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
  }
});


// Render markdown + highlight code
function renderMarkdown(el, text) {
  el.innerHTML = marked.parse(text);

  el.querySelectorAll("pre code").forEach(block => {
    if (!block.className.includes("language-")) {
      block.classList.add("language-python"); // fallback
    }
    hljs.highlightElement(block);
  });
}


function forcePythonCodeBlocks(text) {
  // If code blocks already exist, do nothing
  if (text.includes("```")) return text;

  // Detect Python-like code lines
  const codePattern =
    /(from\s+\w+|import\s+\w+|def\s+\w+|class\s+\w+|for\s+\w+|while\s+|if\s+__name__|print\()/;

  const lines = text.split("\n");
  let hasCode = lines.some(line => codePattern.test(line));

  if (!hasCode) return text;

  return "```python\n" + text + "\n```";
}
document.getElementById("input")?.addEventListener("keydown", e => {
  if (e.key === "Enter" && e.target.disabled) {
    alert("Click New Chat first 🙂");
  }
});

