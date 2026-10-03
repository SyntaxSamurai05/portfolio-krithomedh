import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import fs from 'fs';
import Groq from 'groq-sdk';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// 1. Read profile knowledge base
let profileData = {};
try {
  const rawData = fs.readFileSync('./profileData.json', 'utf-8');
  profileData = JSON.parse(rawData);
} catch (err) {
  console.error('Error loading profileData.json:', err);
}

// 2. Initialize Groq Client
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const systemPrompt = `
You are the AI portfolio assistant for Devansh Kommi.
Answer visitor questions about Devansh's projects, skills, education, experience, coding profiles, and resume concisely, accurately, and professionally.

Devansh's Profile Knowledge:
${JSON.stringify(profileData, null, 2)}

Strict Guidelines:
1. Ground answers strictly in the knowledge base provided above.
2. If asked about his resume, provide this markdown link: "[Download Resume](/resume.pdf)".
3. If asked about his GitHub or coding profiles, provide:
   - GitHub: ${profileData.github || 'https://github.com/SyntaxSamurai05'}
   - LeetCode: ${profileData.leetcode || 'https://leetcode.com/u/devanshk14/'}
   - LinkedIn: ${profileData.linkedin || ''}
4. If a question is irrelevant to Devansh, politely reply: "I can only answer questions about Devansh's technical background, projects, and skills."
5. Keep answers concise with bullet points where helpful.
`;

// 3. Chat Endpoint
app.post('/api/chat', async (req, res) => {
  try {
    const { message, history } = req.body;

    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Valid message string is required.' });
    }

    const messages = [
      { role: 'system', content: systemPrompt },
      ...(history || []).map((entry) => ({
        role: entry.sender === 'user' ? 'user' : 'assistant',
        content: entry.text,
      })),
      { role: 'user', content: message }
    ];

    const chatCompletion = await groq.chat.completions.create({
      messages: messages,
      model: 'openai/gpt-oss-20b',
      temperature: 0.3,
      max_tokens: 300,
    });

    const replyText = chatCompletion.choices[0]?.message?.content || "No response generated.";
    res.json({ reply: replyText });
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({
      reply: "I'm having trouble processing that right now. You can view Devansh's resume directly at /resume.pdf.",
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