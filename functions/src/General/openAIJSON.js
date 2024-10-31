export default async function openAIJSON(prompt) {

    // const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
    const url = 'https://api.openai.com/v1/chat/completions';

    const requestBody = {
        model: "gpt-4-1106-preview",
        messages: [
            {role: "system", content: "You are a helpful assistant. Your response should be in JSON format."},
            { role: "user", content: prompt },
        ],
        response_format: {"type": "json_object"}
    };
    
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify(requestBody),
    });
    
    const messageContent = (await response.json()).choices[0].message.content;
    return JSON.parse(messageContent);
};