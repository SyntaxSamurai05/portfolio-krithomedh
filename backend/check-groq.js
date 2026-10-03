import dotenv from 'dotenv';
import Groq from 'groq-sdk';

dotenv.config();

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

async function list() {
  try {
    const models = await groq.models.list();
    console.log('--- Available Models on your Groq Account ---');
    models.data.forEach((m) => console.log(m.id));
  } catch (err) {
    console.error('Groq Error:', err.message);
  }
}

list();