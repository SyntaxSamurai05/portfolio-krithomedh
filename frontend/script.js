// --- Theme Management ---
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

// --- Scroll Progress Bar ---
const scrollProgressBar = document.getElementById('scrollProgressBar');
window.addEventListener('scroll', () => {
  const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
  const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
  const progressPercent = (scrollTop / scrollHeight) * 100;
  if (scrollProgressBar) {
    scrollProgressBar.style.width = progressPercent + '%';
  }
});

// --- Scroll Reveal Observer ---
const revealObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('active');
      observer.unobserve(entry.target);
    }
  });
}, {
  root: null,
  threshold: 0.12,
  rootMargin: '0px 0px -40px 0px'
});

document.querySelectorAll('.reveal').forEach((el) => {
  revealObserver.observe(el);
});

// --- Project Filtering ---
const filterBtns = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');

filterBtns.forEach((btn) => {
  btn.addEventListener('click', () => {
    filterBtns.forEach((b) => b.classList.remove('active'));
    btn.classList.add('active');

    const filter = btn.getAttribute('data-filter');
    projectCards.forEach((card) => {
      const category = card.getAttribute('data-category');
      if (filter === 'all' || category === filter) {
        card.style.display = 'flex';
      } else {
        card.style.display = 'none';
      }
    });
  });
});

// --- Architecture Snippet Toggle Drawers ---
const snippetToggleBtns = document.querySelectorAll('.snippet-toggle-btn');
snippetToggleBtns.forEach((btn) => {
  btn.addEventListener('click', () => {
    const targetId = btn.getAttribute('data-target');
    const drawer = document.getElementById(targetId);
    if (drawer) {
      drawer.classList.toggle('hidden');
    }
  });
});

// --- Interactive Developer Terminal ---
const terminalDrawer = document.getElementById('terminalDrawer');
const terminalToggleBtn = document.getElementById('terminalToggleBtn');
const terminalCloseDot = document.getElementById('terminalCloseDot');
const terminalInput = document.getElementById('terminalInput');
const terminalOutput = document.getElementById('terminalOutput');

function toggleTerminal() {
  terminalDrawer.classList.toggle('hidden');
  if (!terminalDrawer.classList.contains('hidden')) {
    terminalInput.focus();
  }
}

terminalToggleBtn.addEventListener('click', toggleTerminal);
terminalCloseDot.addEventListener('click', () => terminalDrawer.classList.add('hidden'));

window.addEventListener('keydown', (e) => {
  if (e.key === '`' || (e.ctrlKey && e.key === '~')) {
    e.preventDefault();
    toggleTerminal();
  } else if (e.key === 'Escape' && !terminalDrawer.classList.contains('hidden')) {
    terminalDrawer.classList.add('hidden');
  }
});

terminalInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    const rawCmd = terminalInput.value.trim().toLowerCase();
    terminalInput.value = '';
    executeTerminalCommand(rawCmd);
  }
});

function appendTerminalLine(text, isCommand = false) {
  const p = document.createElement('p');
  if (isCommand) {
    p.innerHTML = `<span class="term-prompt">guest@devansh:~$</span> ${text}`;
  } else {
    p.innerHTML = text;
  }
  terminalOutput.appendChild(p);
  terminalOutput.scrollTop = terminalOutput.scrollHeight;
}

function executeTerminalCommand(cmd) {
  appendTerminalLine(cmd, true);

  switch (cmd) {
    case 'help':
      appendTerminalLine('Available commands: <span class="term-highlight">projects</span>, <span class="term-highlight">skills</span>, <span class="term-highlight">stats</span>, <span class="term-highlight">resume</span>, <span class="term-highlight">clear</span>, <span class="term-highlight">exit</span>');
      break;
    case 'projects':
      appendTerminalLine('• <b>MedVault Core</b> (Node, WebSockets, MongoDB)');
      appendTerminalLine('• <b>CPU Process Scheduling Simulator</b> (C, Flask)');
      appendTerminalLine('• <b>Repo Guardian</b> (llama.cpp, Quantized GGUF, Python)');
      appendTerminalLine('• <b>Vehicle Rental Management</b> (Java, JDBC, MySQL)');
      break;
    case 'skills':
      appendTerminalLine('Languages: Python, C, Java, JavaScript, SQL');
      appendTerminalLine('Stack: Node.js, Express, Flask, React, Tailwind CSS, MongoDB, Git, Linux');
      break;
    case 'stats':
      appendTerminalLine('LeetCode: 250+ algorithmic problems solved across Arrays, DP, and Graphs.');
      appendTerminalLine('GitHub: 12+ public repositories.');
      break;
    case 'resume':
      appendTerminalLine('Opening resume: <a href="resume.pdf" target="_blank" class="term-highlight">resume.pdf</a>');
      window.open('resume.pdf', '_blank');
      break;
    case 'clear':
      terminalOutput.innerHTML = '';
      break;
    case 'exit':
      terminalDrawer.classList.add('hidden');
      break;
    default:
      if (cmd) {
        appendTerminalLine(`Command not found: ${cmd}. Type <span class="term-highlight">help</span> for valid commands.`);
      }
      break;
  }
}

// --- Chatbot Controller ---
const chatToggleBtn = document.getElementById('chatToggleBtn');
const chatCloseBtn = document.getElementById('chatCloseBtn');
const chatModal = document.getElementById('chatModal');
const chatForm = document.getElementById('chatForm');
const chatInput = document.getElementById('chatInput');
const chatMessages = document.getElementById('chatMessages');
const quickPromptBtns = document.querySelectorAll('.quick-prompt-btn');
const projectAiBtns = document.querySelectorAll('.project-ai-btn');

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

projectAiBtns.forEach((btn) => {
  btn.addEventListener('click', () => {
    const prompt = btn.getAttribute('data-ask');
    chatModal.classList.remove('hidden');
    chatToggleBtn.parentElement.classList.add('hidden');
    sendUserQuery(prompt);
  });
});