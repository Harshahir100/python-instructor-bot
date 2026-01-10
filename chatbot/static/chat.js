/**
 * Main Chat Application
 * Imports modular components and sets up keyboard event listeners
 */

// Import all modules (in HTML, load scripts in order before this file)
// <script src="modules/scroll.js"></script>
// <script src="modules/history.js"></script>
// <script src="modules/utils.js"></script>
// <script src="modules/send.js"></script>
// <script src="chat.js"></script>

/**
 * Keyboard Event Listener
 * Sends message on Enter key press
 */
document.getElementById("input")?.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    e.preventDefault(); // Prevent newline

    if (e.target.disabled) {
      alert("Click New Chat first 🙂");
    } else {
      handleSend(); // Send message on Enter
    }
  }
});
