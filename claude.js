require('dotenv').config();
const Anthropic = require('@anthropic-ai/sdk');

const anthropic = new Anthropic({
    apiKey: `${process.env.VITE_ANTHROPIC_API_KEY}`,
  });

const hi = async () => {
const gptResponse = await anthropic.messages.create({
    // model: "claude-3-sonnet-20240229",
    model: "claude-3-haiku-20240307",
    system: "copy this style to respond to user: WHATS UP MAN? IM DOING FANTASTIC!!!!",
    max_tokens: 4024,
    messages: [{ role: "user", content: "give me 10 example topics for estate law blog posts" }],
});
return gptResponse;
}

hi().then((data) => {
    console.log(data.content[0].text);
});

