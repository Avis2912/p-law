require('dotenv').config();
const Anthropic = require('@anthropic-ai/sdk');

const anthropic = new Anthropic({
    apiKey: `${process.env.VITE_ANTHROPIC_API_KEY}`,
  });

const hi = async () => {
const gptResponse = await anthropic.messages.create({
    model: "claude-3-sonnet-20240229",
    max_tokens: 4024,
    messages: [{ role: "user", content: "Hello, Claude. hows it going?" }],
});
return gptResponse;
}

hi().then((data) => {
    console.log(data.content[0].text);
});

