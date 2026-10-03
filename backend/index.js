import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import fs from 'fs';
import Groq from 'groq-sdk';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

let profileData = {};
try {
  const rawData = fs.readFileSync('./profileData.json', 'utf-8');
  profileData = JSON.parse(rawData);
} catch (err) {
  console.error('Error loading profileData.json:', err);
}

async function getLiveLeetCodeStats(username = 'devanshk14') {
  try {
    const query = `
      query userProblemsSolved($username: String!) {
        matchedUser(username: $username) {
          submitStatsGlobal {
            acSubmissionNum {
              difficulty
              count
            }
          }
        }
      }
    `;

    const res = await fetch('https://leetcode.com/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Referer': 'https://leetcode.com'
      },
      body: JSON.stringify({ query, variables: { username } })
    });

    const data = await res.json();
    const stats = data?.data?.matchedUser?.submitStatsGlobal?.acSubmissionNum;
    if (!stats) return null;

    const total = stats.find(s => s.difficulty === 'All')?.count || 0;
    const easy = stats.find(s => s.difficulty === 'Easy')?.count || 0;
    const medium = stats.find(s => s.difficulty === 'Medium')?.count || 0;
    const hard = stats.find(s => s.difficulty === 'Hard')?.count || 0;

    return `${total} total solved (${easy} Easy, ${medium} Medium, ${hard} Hard)`;
  } catch (err) {
    console.error('Failed to fetch live LeetCode stats:', err.message);
    return null;
  }
}
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
app.post('/api/chat', async (req, res) => {
  try {
    const { message, history } = req.body;

    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Valid message string is required.' });
    }

    const liveLeetCode = await getLiveLeetCodeStats('devanshk14');
    const leetCodeInfo = liveLeetCode || profileData.codingProfiles.leetcode.solvedProblems;

    const systemPrompt = `
You are KOMMI VENKATA SAI DEVANSH's personal AI portfolio assistant.
Your goal is to answer visitor questions directly, clearly, concisely, and professionally.

Devansh's Information:
${JSON.stringify(profileData, null, 2)}

Strict Response Rules:
1. Speak in simple, clear, conversational English.
2. DO NOT ramble, repeat yourself, or generate filler introductions.
3. For greetings ("hi", "hello", "who are you"):
   - Say: "Hello! I'm Devansh's AI assistant. Ask me about his engineering projects, technical stack, LeetCode stats, or resume!"
4. For LeetCode questions:
   - State the exact stats: "${leetCodeInfo}".
   - Provide the direct link: [LeetCode Profile](${profileData.codingProfiles.leetcode.url}).
5. For GitHub / projects:
   - Name the project, state 1-2 sentence description, and list the stack.
6. For Resume:
   - Provide: "[Download Resume](resume.pdf)".
7. Format with clean bullet points and short paragraphs. Avoid dense walls of text.
`;

    const messages = [
      { role: 'system', content: systemPrompt },
      ...(history || []).slice(-6).map((entry) => ({
        role: entry.sender === 'user' ? 'user' : 'assistant',
        content: entry.text,
      })),
      { role: 'user', content: message }
    ];

    const chatCompletion = await groq.chat.completions.create({
      messages: messages,
      model: 'qwen/qwen3.8-27b',
      temperature: 0.2,
      max_tokens: 300,
    });

    const replyText = chatCompletion.choices[0]?.message?.content || "No response generated.";
    res.json({ reply: replyText });
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({
      reply: "I'm having trouble processing that right now. You can view Devansh's resume directly at [Download Resume](resume.pdf)."
    });
  }
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'portfolio-backend' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});