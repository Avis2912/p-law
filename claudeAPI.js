const express = require('express');

const cors = require('cors');

const app = express();
const port = 3050;

require('dotenv').config();

const Anthropic = require('@anthropic-ai/sdk');

const anthropic = new Anthropic({
  apiKey: `${process.env.VITE_ANTHROPIC_API_KEY}`,
});

// const corsOptions = {
//   origin: '*', // Replace with your production domain
//   optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
// };

app.use(cors());
app.use(express.json()); // Use express.json middleware to parse JSON bodies

app.post('/claudeAPI', (req, res) => {
  const messages = req.body.messages; // Access messages from request body
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

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});