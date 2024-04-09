const express = require('express');
const cors = require('cors');
const Anthropic = require('@anthropic-ai/sdk');

require('dotenv').config();

const anthropic = new Anthropic({
    apiKey: `${process.env.VITE_ANTHROPIC_API_KEY}`,
});

const app = express();

app.use(cors());
app.use(express.json());

app.post('/claudeAPI', (req, res) => {
    const messages = req.body.messages;
    const model = req.body.model; 
    const system = req.body.system;

    const hi = async () => {
        const gptResponse = await anthropic.messages.create({
            model,
            system,
            max_tokens: 4096,
            messages, 
        });
        return gptResponse;
    }
        
    hi().then((data) => {
        res.send(data.content[0].text);
    });
});

module.exports = app;