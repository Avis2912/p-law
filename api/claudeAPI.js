const cors = require('cors');
const Anthropic = require('@anthropic-ai/sdk');

require('dotenv').config();

const anthropic = new Anthropic({
    apiKey: `${process.env.VITE_ANTHROPIC_API_KEY}`,
});

const corsMiddleware = cors();

module.exports = (req, res) => {
    // Run the cors middleware
    corsMiddleware(req, res, async () => {
        if (req.method === 'POST') {
            const messages = req.body.messages;
            const model = req.body.model; 
            const system = req.body.system;

            const gptResponse = await anthropic.messages.create({
                model,
                system,
                max_tokens: 4096,
                messages, 
            });

            res.send(gptResponse.content[0].text);
        } else {
            // Handle any other HTTP method
            res.status(405).send('Method Not Allowed');
        }
    });
};