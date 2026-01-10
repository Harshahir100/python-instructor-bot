/**
 * History Management
 * Handles chat creation, deletion, and history
 */

// Create new chat
function newChat() {
  fetch("/new-chat/")
    .then((r) => r.json())
    .then((d) => (location.href = `/?c=${d.id}`));
}

// Delete single chat
function deleteChat(id) {
  fetch(`/delete/${id}/`).then(() => location.reload());
}

// Delete all chats
function deleteAll() {
  if (confirm("Delete all conversations?")) {
    fetch("/delete-all/").then(() => location.reload());
  }
}
