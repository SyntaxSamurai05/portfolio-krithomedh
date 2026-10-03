import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import fs from 'fs';
import { GoogleGenerativeAI } from '@google/generative-ai';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// 1. Read the profile knowledge base
let profileData = {};
try {
  const rawData = fs.readFileSync('./profileData.json', 'utf-8');
  profileData = JSON.parse(rawData);
} catch (err) {
  console.error('Error loading profileData.json:', err);
}

// 2. Initialize Gemini API
const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  console.error('Warning: GEMINI_API_KEY is not defined in .env');
}

const genAI = new GoogleGenerativeAI(apiKey || '');

const systemInstruction = `
You are the personal portfolio assistant for Devansh Kommi.
Your purpose is to answer questions from visitors about Devansh's projects, technical skills, education, experience, coding profiles, and resume.

Devansh's Profile Knowledge:
${JSON.stringify(profileData, null, 2)}

Strict Guidelines:
1. Ground your answers strictly in the knowledge provided above.
2. If asked about his resume, guide the user to download it via the link: "[Download Resume](/resume.pdf)".
3. If asked about his GitHub or coding profiles, provide the specific handles/links:
   - GitHub: ${profileData.github || 'https://github.com/SyntaxSamurai05'}
   - LeetCode: ${profileData.leetcode || 'https://leetcode.com/u/devanshk14/'}
   - LinkedIn: ${profileData.linkedin || ''}
4. If a question is irrelevant to Devansh, politely state that you can only answer questions about Devansh's technical background, projects, and skills.
5. Keep your tone polite, professional, and clear. Use concise bullet points or bold text where appropriate.
`;

const model = genAI.getGenerativeModel({
  model: 'gemini-1.5-flash',
  systemInstruction: systemInstruction,
});

// 3. Chat API Endpoint
app.post('/api/chat', async (req, res) => {
  try {
    const { message, history } = req.body;

    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Valid message string is required.' });
    }

    // Format chat history for Gemini API
    const formattedHistory = (history || []).map((entry) => ({
      role: entry.sender === 'user' ? 'user' : 'model',
      parts: [{ text: entry.text }],
    }));

    const chatSession = model.startChat({
      history: formattedHistory,
    });

    const result = await chatSession.sendMessage(message);
    const response = await result.response;
    const replyText = response.text();

    res.json({ reply: replyText });
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({
      reply: "I'm having trouble processing that request right now. You can check Devansh's resume directly at /resume.pdf.",
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'portfolio-backend' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Backend server is running on http://localhost:${PORT}`);
});