// src/api/scrapeAds.js
const express = require('express');
const cors = require('cors');
const puppeteer = require('puppeteer-core');
const chromium = require('@sparticuz/chromium');
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
  const TIMEOUT = 250000; // 250 seconds
  const timeoutPromise = new Promise((_, reject) => 
    setTimeout(() => reject(new Error('Scraping timeout')), TIMEOUT)
  );

  console.log('=== SCRAPING START ===');
  console.log('Environment:', process.env.NODE_ENV);
  console.log('Keyword:', keyword);

  let browser;
  try {
    console.log('Attempting to launch browser...');
    
    // Configure Chromium with proper executable path handling
    const executablePath = process.env.NODE_ENV === 'production'
      ? await chromium.executablePath()
      : process.env.CHROME_PATH || '';

    console.log('Executable path:', executablePath);
    console.log('Type of executablePath:', typeof executablePath);

    if (typeof executablePath !== 'string') {
      throw new Error(`Executable path must be a string, received ${typeof executablePath}`);
    }

    const launchOptions = {
      args: [
        ...chromium.args,
        '--disable-gpu',
        '--disable-dev-shm-usage',
        '--disable-setuid-sandbox',
        '--no-first-run',
        '--no-sandbox',
        '--no-zygote',
        '--single-process',
      ],
      defaultViewport: chromium.defaultViewport,
      executablePath: executablePath,
      headless: chromium.headless,
      ignoreHTTPSErrors: true,
    };

    browser = await puppeteer.launch(launchOptions);

    console.log('Browser launched successfully');

    const page = await browser.newPage();
    await page.setDefaultNavigationTimeout(60000);
    await page.setDefaultTimeout(30000);

    const result = {
      SPEND: '',
      ADS: []
    };

    // Race between scraping and timeout
    await Promise.race([
      (async () => {
        await page.goto('https://adstransparency.google.com/?region=US&preset-date=Last+30+days', {
          waitUntil: 'domcontentloaded',
          timeout: 30000
        });
    
        // Reduce wait times
        await page.waitForTimeout(1500);
    
        console.log('Waiting for search box...');
        await page.waitForTimeout(1500);
    
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
    
        await page.waitForTimeout(750);
    
        try {
          await page.click('.suggestion-renderer-container');
        } catch (error) {
          console.log('Could not click suggestion container:', error.message);
          return {
            SPEND: '',
            ADS: []
          };
        }   
    
        await page.waitForTimeout(750);
        await page.evaluate(() => {window.scrollTo(0, document.body.scrollHeight);});
    
        const creativePreviews = await page.$$('creative-preview');
        
        if (creativePreviews.length > 0) {
          console.log(`Found ${creativePreviews.length} ads`);
          await page.waitForTimeout(1250);
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
        await page.waitForTimeout(1000);
    
        const estGoogleSpend = await page.$eval('div[data-test="valueC"]', div => div.textContent || '$0.00');
        console.log('Estimated Google Spend:', estGoogleSpend);
        result.SPEND = estGoogleSpend.trim() || '';
    
        return result; // Ensure the function returns the result object
      })(),
      timeoutPromise
    ]);

    return result;
  } catch (error) {
    if (error.message === 'Scraping timeout') {
      console.error('Scraping timed out after', TIMEOUT/1000, 'seconds');
    }
    console.error('=== BROWSER LAUNCH ERROR ===');
    console.error('Error Type:', error.constructor.name);
    console.error('Error Message:', error.message);
    console.error('Error Stack:', error.stack);
    throw new Error(`Browser launch failed: ${error.message}`);
  } finally {
    if (browser) {
      console.log('Closing browser...');
      await browser.close().catch(console.error);
      console.log('Browser closed');
    }
    console.log('=== SCRAPING END ===');
  }
}

app.post('/scrape', async (req, res) => {
  const requestStart = Date.now();
  console.log('=== REQUEST START ===');
  console.log('Time:', new Date().toISOString());
  console.log('Body:', req.body);
  console.log('Headers:', req.headers);
  
  try {
    const result = await scrapeGoogleAdsLibrary(req.body.keyword);
    console.log('Scrape completed successfully');
    console.log('Result:', result);
    return res.json(result);
  } catch (error) {
    console.error('=== REQUEST ERROR ===');
    console.error('Error occurred after:', Date.now() - requestStart, 'ms');
    console.error('Full error:', {
      name: error.name,
      message: error.message,
      stack: error.stack,
      code: error.code
    });
    
    return res.status(500).json({
      error: 'Scraping failed',
      details: error.message,
      time: new Date().toISOString(),
      duration: Date.now() - requestStart,
      env: process.env.NODE_ENV
    });
  } finally {
    console.log('=== REQUEST END ===');
    console.log('Duration:', Date.now() - requestStart, 'ms');
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

// Export the Express app as 'scrapeAds'
exports.scrapeAds = app;