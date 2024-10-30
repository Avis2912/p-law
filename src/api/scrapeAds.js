// src/api/scrapeAds.js
const express = require('express');
const cors = require('cors');
const { chromium } = require('playwright-core');
const path = require('path');

const app = express();
const port = process.env.PORT || 3040;

// Configure CORS with dynamic origin
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://app.pentra.club'] // Replace with your Vercel domain
    : ['http://localhost:3030', 'http://localhost:5173'], // Include both Vite's default port and your custom port
  methods: ['POST', 'GET', 'OPTIONS'],
  allowedHeaders: ['Content-Type'],
  credentials: true
}));

app.use(express.json());

async function scrapeGoogleAdsLibrary(keyword) {
  console.log('Scraping Google Ads Library for:', keyword);
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  const result = {
    SPEND: '',
    ADS: []
  };

  try {
    console.log('Navigating to Google Ads Library...');
    await page.goto('https://adstransparency.google.com/?region=US&preset-date=Last+30+days');

    console.log('Waiting for search box...');
    await page.waitForTimeout(3000);

    const search = await page.$('[debugid="acx_177925851_179054344"]');
    
    if (search) {
      await search.evaluate((input, keywordToo) => {
        input.value = keywordToo;
        input.dispatchEvent(new Event('input'));
      }, keyword);
      await page.waitForTimeout(500);
      await search.click();
    } else {
      console.error('Search box not found');
      return result;
    }

    await page.waitForTimeout(1500);

    // const suggestionContainer = await page.$('.suggestion-renderer-container');
    // if (!suggestionContainer) {
    //   console.log('No suggestion container found - returning empty results');
    //   return {
    //     SPEND: '',
    //     ADS: []
    //   };
    // }
    
    try {
      await page.click('.suggestion-renderer-container');
    } catch (error) {
      console.log('Could not click suggestion container:', error.message);
      return {
        SPEND: '',
        ADS: []
      };
    }   

    // await page.click('.suggestion-renderer-container');
    await page.waitForTimeout(1500);
    await page.evaluate(() => {window.scrollTo(0, document.body.scrollHeight);});

    const creativePreviews = await page.$$('creative-preview');
    
    if (creativePreviews.length > 0) {
      console.log(`Found ${creativePreviews.length} ads`);
      await page.waitForTimeout(2500);
      for (const preview of creativePreviews) {
        const imgSrc = await preview.evaluate(el => {
          const img = el.querySelector('img');
          if (img) return img.src;
          
          const video = el.querySelector('video');
          if (video) return video.src;
      
          return null;
        });
        
        if (imgSrc) {
          result.ADS.push({ preview: imgSrc });
        } else {
          console.log('No image or video found in ad preview');
        }
      }
    } else {
      console.log('No ads found');
    }

    console.log('Checking SpyFu for spend data...');
    await page.goto(`https://www.spyfu.com/overview/domain?query=${keyword}`);
    await page.waitForTimeout(2000);

    const estGoogleSpend = await page.$eval('div[data-test="valueC"]', div => div.textContent || '$0.00');
    console.log('Estimated Google Spend:', estGoogleSpend);
    result.SPEND = estGoogleSpend.trim() || '';

  } catch (error) {
    console.error('Error during scraping:', error);
  } finally {
    await browser.close();
  }

  return result;
}
app.post('/scrape', async (req, res) => {
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

// Add a health check endpoint
app.get('/health', (req, res) => {
  res.send({ status: 'ok' });
});

// Only add static file serving in production
if (process.env.NODE_ENV === 'production') {
  const distPath = path.join(process.cwd(), 'dist');
  app.use(express.static(distPath));
  app.get('*', (req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

// Export the app for potential testing
module.exports = app;

// Only start the server if this file is run directly
if (require.main === module) {
  app.listen(port, () => {
    console.log(`API server running at http://localhost:${port}`);
  });
}