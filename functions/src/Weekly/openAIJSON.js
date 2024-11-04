require('dotenv').config({ path: '../../../.env' });
const fetch = require('node-fetch');

async function openAIJSON(prompt) {
    const apiKey = process.env.VITE_OPENAI_API_KEY;
    
    if (!apiKey) {
        throw new Error('OpenAI API key is not defined in environment variables');
    }

    const url = 'https://api.openai.com/v1/chat/completions';

    const requestBody = {
        model: "gpt-4o-mini",
        messages: [
            { role: "system", content: "You are a helpful assistant. Your response should be in JSON format." },
            { role: "user", content: prompt },
        ],
        response_format: { "type": "json_object" }
    };

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`,
            },
            body: JSON.stringify(requestBody),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(`OpenAI API error: ${data.error?.message || 'Unknown error'}`);
        }

        if (!data.choices || !data.choices[0] || !data.choices[0].message) {
            throw new Error('Unexpected API response format');
        }

        const messageContent = data.choices[0].message.content;
        return JSON.parse(messageContent);
    } catch (error) {
        console.error('Error in openAIJSON:', error.message);
        throw error;
    }
}

module.exports = openAIJSON;