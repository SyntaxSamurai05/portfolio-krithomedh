const chatToggleBtn = document.getElementById('chatToggleBtn');
const chatCloseBtn = document.getElementById('chatCloseBtn');
const chatModal = document.getElementById('chatModal');
const chatForm = document.getElementById('chatForm');
const chatInput = document.getElementById('chatInput');
const chatMessages = document.getElementById('chatMessages');

const chatHistory = [];

chatToggleBtn.addEventListener('click', () => {
  chatModal.classList.remove('hidden');
  chatToggleBtn.parentElement.classList.add('hidden');
  chatInput.focus();
});

chatCloseBtn.addEventListener('click', () => {
  chatModal.classList.add('hidden');
  chatToggleBtn.parentElement.classList.remove('hidden');
});

function appendMessage(text, sender) {
  const msgEl = document.createElement('div');
  msgEl.classList.add('message', sender);
  msgEl.innerText = text;
  chatMessages.appendChild(msgEl);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

chatForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const message = chatInput.value.trim();
  if (!message) return;

  appendMessage(message, 'user');
  chatInput.value = '';

  const loadingEl = document.createElement('div');
  loadingEl.classList.add('message', 'bot');
  loadingEl.innerText = 'Thinking...';
  chatMessages.appendChild(loadingEl);
  chatMessages.scrollTop = chatMessages.scrollHeight;

  try {
    const res = await fetch('http://localhost:5000/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: message,
        history: chatHistory
      })
    });

    const data = await res.json();
    loadingEl.remove();

    const botReply = data.reply || "I didn't catch that. Could you rephrase?";
    appendMessage(botReply, 'bot');

    chatHistory.push({ sender: 'user', text: message });
    chatHistory.push({ sender: 'bot', text: botReply });
  } catch (err) {
    loadingEl.remove();
    appendMessage("Cannot reach backend server. Make sure node index.js is running on port 5000.", "bot");
  }
});