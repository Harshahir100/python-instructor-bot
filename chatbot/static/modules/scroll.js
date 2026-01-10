/**
 * Scroll Utilities
 * Handles all auto-scroll functionality
 */

function scrollToBottom() {
  const messages = document.getElementById("messages");
  if (!messages) return;

  // wait for DOM paint
  requestAnimationFrame(() => {
    messages.scrollTop = messages.scrollHeight;
  });
}

function scrollToBottomSmooth() {
  const anchor = document.getElementById("scroll-anchor");
  if (!anchor) return;

  anchor.scrollIntoView({ behavior: "smooth", block: "end" });
}
