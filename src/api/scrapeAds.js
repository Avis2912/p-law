// src/api/scrapeAds.js
const express = require('express');
const cors = require('cors');
const { chromium } = require('playwright-core');
const path = require('path');

const app = express();
const port = process.env.PORT || 3040;
const isDevelopment = process.env.NODE_ENV !== 'production';

// Update CORS configuration
app.use(cors({
  origin: ['https://app.pentra.club', 'http://localhost:3030', 'http://localhost:5173'],
  methods: ['POST', 'GET', 'OPTIONS'],
  allowedHeaders: ['Content-Type'],
  credentials: true
}));

app.use(express.json());

async function scrapeGoogleAdsLibrary(keyword) {
  console.log('[Debug] Starting scrape for:', keyword);
  let browser;
  
  try {
    const browserConfig = {
      headless: true,
      args: [
        '--autoplay-policy=user-gesture-required',
        '--disable-background-networking',
        '--disable-background-timer-throttling',
        '--disable-backgrounding-occluded-windows',
        '--disable-breakpad',
        '--disable-client-side-phishing-detection',
        '--disable-component-update',
        '--disable-default-apps',
        '--disable-dev-shm-usage',
        '--disable-domain-reliability',
        '--disable-extensions',
        '--disable-features=AudioServiceOutOfProcess',
        '--disable-hang-monitor',
        '--disable-ipc-flooding-protection',
        '--disable-notifications',
        '--disable-offer-store-unmasked-wallet-cards',
        '--disable-popup-blocking',
        '--disable-print-preview',
        '--disable-prompt-on-repost',
        '--disable-renderer-backgrounding',
        '--disable-setuid-sandbox',
        '--disable-speech-api',
        '--disable-sync',
        '--hide-scrollbars',
        '--ignore-gpu-blacklist',
        '--metrics-recording-only',
        '--mute-audio',
        '--no-default-browser-check',
        '--no-first-run',
        '--no-pings',
        '--no-sandbox',
        '--no-zygote',
        '--password-store=basic',
        '--use-gl=swiftshader',
        '--use-mock-keychain',
      ],
      executablePath: process.env.NODE_ENV === 'production' 
        ? '/var/task/node_modules/@playwright/browser-chromium/chromium/chrome-linux/chrome'
        : undefined
    };
    
    console.log('[Debug] Launching browser with config:', browserConfig);
    browser = await chromium.launch(browserConfig);

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

      try {
        await page.click('.suggestion-renderer-container');
      } catch (error) {
        console.log('Could not click suggestion container:', error.message);
        return {
          SPEND: '',
          ADS: []
        };
      }   

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
      console.error('Detailed scraping error:', error);
      throw error; // Propagate error for better debugging
    } finally {
      await browser.close();
    }

    return result;
  } catch (error) {
    console.error('[Debug] Fatal error in scraper:', {
      message: error.message,
      stack: error.stack,
      keyword,
      env: process.env.NODE_ENV
    });
    throw error;
  } finally {
    if (browser) {
      await browser.close().catch(console.error);
    }
  }
}

app.post('/scrape', async (req, res) => {
  console.log('[Debug] Received request:', {
    body: req.body,
    path: req.path,
    method: req.method,
    env: process.env.NODE_ENV,
  });
  
  const { keyword } = req.body;
  if (!keyword) {
    console.error('[Debug] Missing keyword in request');
    return res.status(400).json({ error: 'Keyword is required' });
  }
  
  try {
    const result = await scrapeGoogleAdsLibrary(keyword);
    console.log('[Debug] Scrape result:', result);
    return res.json(result);
  } catch (error) {
    console.error('[Debug] Scrape error:', error);
    // Include error stack in development mode
    return res.status(500).json({ 
      error: 'Failed to scrape Google Ads Library',
      details: error.message,
      stack: isDevelopment ? error.stack : undefined,
    });
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