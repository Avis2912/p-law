// server.js (Move this to the root directory)
const express = require('express');
const cors = require('cors');
const { chromium } = require('playwright-core');
const path = require('path');

const app = express();
const port = process.env.PORT || 3040;

// Configure CORS with dynamic origin
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://your-app-name.vercel.app'] // Replace with your Vercel domain
    : 'http://localhost:3030',
  methods: ['POST', 'GET', 'OPTIONS'],
  allowedHeaders: ['Content-Type']
}));

app.use(express.json());

// Your existing scrapeGoogleAdsLibrary function
async function scrapeGoogleAdsLibrary(keyword) {
  // ... (your existing function code)
}

app.post('/api/scrape', async (req, res) => {
  const { keyword } = req.body;
  if (!keyword) {
    return res.status(400).send({ error: 'Keyword is required' });
  }
  try {
    const result = await scrapeGoogleAdsLibrary(keyword);
    return res.send(result);
  } catch (error) {
    return res.status(500).send({ error: 'Failed to scrape Google Ads Library' });
  }
});

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'dist')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
  });
}

app.listen(port, () => {
  console.log(`API server running at http://localhost:${port}`);
});