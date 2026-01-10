/**
 * Send Message Logic
 * Handles sending messages and receiving streaming responses
 */

function handleSend() {
  const input = document.getElementById("input");
  if (!input) {
    console.error("Input not found");
    return;
  }

  const msg = input.value.trim();
  if (!msg) return;

  if (!window.ACTIVE_CHAT_ID) {
    // create chat first
    fetch("/new-chat/")
      .then((res) => res.json())
      .then((data) => {
        window.ACTIVE_CHAT_ID = data.id;

        // update URL without reload
        history.replaceState(null, "", `/?c=${data.id}`);

        sendMessage(data.id, msg);
      })
      .catch((err) => console.error("New chat error:", err));
  } else {
    sendMessage(window.ACTIVE_CHAT_ID, msg);
  }

  input.value = "";
}

function sendMessage(convoId, msg) {
  const messages = document.getElementById("messages");

  messages.innerHTML += `<div class="user">${msg}</div>`;
  scrollToBottom();

  const bot = document.createElement("div");
  bot.className = "bot";
  bot.textContent = ""; // plain text while streaming
  messages.appendChild(bot);
  scrollToBottom();

  fetch(`/chat/${convoId}/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message: msg }),
  }).then((res) => {
    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let full = "";

    function read() {
      reader.read().then(({ done, value }) => {
        if (done) {
          // Final markdown render when stream completes
          bot.innerHTML = marked.parse(full);

          // Highlight code blocks
          bot.querySelectorAll("pre code").forEach((block) => {
            hljs.highlightElement(block);
          });

          // Ensure scroll after content is fully rendered
          messages.scrollTop = messages.scrollHeight;
          requestAnimationFrame(() => {
            messages.scrollTop = messages.scrollHeight;
            scrollToBottomSmooth();
          });
          return;
        }
        full += decoder.decode(value);
        bot.textContent = full; // Show plain text while streaming
        messages.scrollTop = messages.scrollHeight; // Scroll container
        scrollToBottom(); // Scroll to anchor
        read();
      });
    }
    read();
  });
}
