# Personal Portfolio & AI Assistant

A modern, high-performance developer portfolio built with semantic HTML5, modular CSS, vanilla JavaScript, and an integrated AI assistant backend powered by Groq LLM inference and live LeetCode GraphQL statistics.

---

## Features

- **Semantic Frontend**: Built entirely without heavy frontend frameworks—pure HTML5, modular CSS3, and vanilla ES6+ JavaScript.
- **Modular CSS Architecture**:
  - `variables.css`: Design tokens, palette scales, and dynamic dark/light theme definitions.
  - `base.css`: CSS reset, base typography, navigation bar, and theme switcher styling.
  - `layout.css`: Responsive grid systems, project cards, experience timeline, and metrics.
  - `chatbot.css`: Floating widget positioning, chat bubbles, quick prompt pills, and animations.
- **Dark / Light Theme Toggle**: Persistent theme switching using `localStorage` and `data-theme` attributes.
- **Real-Time LeetCode Metrics**: Direct server-side GraphQL integration to fetch live problem-solving statistics directly from LeetCode.
- **AI Portfolio Assistant**:
  - Powered by Groq's high-speed inference engine (`qwen/qwen3.8-27b`).
  - Grounded strictly in `profileData.json` to prevent hallucinations.
  - Formatted output rendering via `marked.js` with interactive quick-prompt suggestions.

---

## Project Structure

```text
portfolio-krithomedh/
├── backend/
│   ├── .env.example
│   ├── index.js               # Express server, LeetCode GraphQL fetch, Groq AI route
│   ├── package.json           # Node.js dependencies
│   └── profileData.json       # Structured knowledge base for projects, skills, and bio
├── frontend/
│   ├── index.html             # Semantic markup for all sections & assistant modal
│   ├── script.js              # Theme switcher logic, chat events, marked.js parser
│   ├── variables.css          # Design tokens & color variables
│   ├── base.css               # Typography, global reset, and navbar
│   ├── layout.css             # Section layouts, project grid, and timeline
│   ├── chatbot.css            # Chatbot modal, message bubbles, and action bar
│   └── resume.pdf             # One-page technical resume
├── .gitignore
└── README.md