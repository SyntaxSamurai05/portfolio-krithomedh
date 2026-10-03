const themeToggleBtn = document.getElementById('themeToggleBtn');
const themeIcon = document.getElementById('themeIcon');
const htmlElement = document.documentElement;

const savedTheme = localStorage.getItem('portfolio-theme') || 'dark';
htmlElement.setAttribute('data-theme', savedTheme);
updateThemeIcon(savedTheme);

themeToggleBtn.addEventListener('click', () => {
  const currentTheme = htmlElement.getAttribute('data-theme');
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

  htmlElement.setAttribute('data-theme', newTheme);
  localStorage.setItem('portfolio-theme', newTheme);
  updateThemeIcon(newTheme);
});

function updateThemeIcon(theme) {
  if (theme === 'light') {
    themeIcon.classList.remove('fa-moon');
    themeIcon.classList.add('fa-sun');
  } else {
    themeIcon.classList.remove('fa-sun');
    themeIcon.classList.add('fa-moon');
  }
}

const chatToggleBtn = document.getElementById('chatToggleBtn');
const chatCloseBtn = document.getElementById('chatCloseBtn');
const chatModal = document.getElementById('chatModal');
const chatForm = document.getElementById('chatForm');
const chatInput = document.getElementById('chatInput');
const chatMessages = document.getElementById('chatMessages');
const quickPromptBtns = document.querySelectorAll('.quick-prompt-btn');

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

function appendMessage(text, sender, isHTML = false) {
  const bubble = document.createElement('div');
  bubble.classList.add('message-bubble', sender === 'user' ? 'user-bubble' : 'bot-bubble');

  if (isHTML && window.marked) {
    bubble.innerHTML = marked.parse(text);
  } else {
    bubble.innerText = text;
  }

  chatMessages.appendChild(bubble);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

async function sendUserQuery(userText) {
  appendMessage(userText, 'user');
  chatInput.value = '';

  const loadingBubble = document.createElement('div');
  loadingBubble.classList.add('message-bubble', 'bot-bubble');
  loadingBubble.innerText = 'Thinking...';
  chatMessages.appendChild(loadingBubble);
  chatMessages.scrollTop = chatMessages.scrollHeight;

  try {
    const res = await fetch('http://localhost:5000/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: userText,
        history: chatHistory
      })
    });

    const data = await res.json();
    loadingBubble.remove();

    const botReply = data.reply || "I didn't quite catch that. Could you rephrase?";
    appendMessage(botReply, 'bot', true);

    chatHistory.push({ sender: 'user', text: userText });
    chatHistory.push({ sender: 'bot', text: botReply });
  } catch (err) {
    loadingBubble.remove();
    appendMessage("Cannot reach backend server. Make sure node index.js is running on port 5000.", 'bot');
  }
}

chatForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const text = chatInput.value.trim();
  if (!text) return;
  sendUserQuery(text);
});

quickPromptBtns.forEach((btn) => {
  btn.addEventListener('click', () => {
    const query = btn.getAttribute('data-query');
    sendUserQuery(query);
  });
});