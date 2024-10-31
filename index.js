const cors = require('cors');
const express = require('express');
const Anthropic = require('@anthropic-ai/sdk');
const fetch = require('node-fetch').default;
const { send } = require('process');

require('dotenv').config();

const anthropic = new Anthropic({
    apiKey: `${process.env.VITE_ANTHROPIC_API_KEY}`,
});

const app = express();

app.use(cors());
app.use(express.json());

app.post('/', (req, res) => {
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

exports.claudeAPI = (req, res) => {
    res.set('Access-Control-Allow-Origin', '*');
    res.set('Access-Control-Allow-Methods', 'GET, POST');
    res.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-API-Key');

    app(req, res);
};

exports.youAPIFunction = (req, res) => {
    // Set CORS headers
    res.set('Access-Control-Allow-Origin', '*');
    res.set('Access-Control-Allow-Methods', 'GET, POST');
    res.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-API-Key');

    const apiKey = '7cc375a9-d226-4d79-b55d-b1286ddb4609<__>1P4FjdETU8N2v5f458P2BaEp-Pu3rUjGEYkI4jh';
    const query = encodeURIComponent(req.body.prompt);
    const youUrl = `https://api.ydc-index.io/rag?query=${query}`;

    const options = {
        method: 'GET',
        headers: {
            'X-API-Key': apiKey
        }
    };

    fetch(youUrl, options)
        .then(response => response.json())
        .then(response => {
            console.log(response.answer);
            res.status(200).send(response);
        })
        .catch(err => {
            console.error(err);
            res.status(500).send(err);
        });
};