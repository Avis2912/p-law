require('dotenv').config();
const Anthropic = require('@anthropic-ai/sdk');
const fetch = require('node-fetch');

const anthropic = new Anthropic({
    apiKey: `${process.env.VITE_ANTHROPIC_API_KEY}`,
  });

const hi = async () => {
    const gptResponse = await fetch('https://us-central1-pentra-claude-gcp.cloudfunctions.net/gcp-claudeAPI', {
      method: 'POST', headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({ messages: [{role: "user", content: "hey"}], model: 'claude-3-sonnet-20240229' 
}) });

return gptResponse;
}

hi().then(async (data) => {
    const text = await data.text();
    console.log(text);
});

