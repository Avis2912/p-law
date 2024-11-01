const express = require('express');
const cors = require('cors');
const puppeteer = require('puppeteer-core');
const chromium = require('@sparticuz/chromium');

const app = express();

app.use(cors({
  origin: '*',
  methods: ['POST', 'GET', 'OPTIONS'],
  allowedHeaders: ['Content-Type'],
  credentials: true
}));

app.use(express.json());

async function scrapeGoogleAdsLibrary(keyword) {
  const TIMEOUT = 250000;
  const timeoutPromise = new Promise((_, reject) => 
    setTimeout(() => reject(new Error('Scraping timeout')), TIMEOUT)
  );

  console.log('=== SCRAPING START ===');
  console.log('Keyword:', keyword);

  let browser;
  try {
    console.log('Attempting to launch browser...');
    
    const executablePath = await chromium.executablePath();

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

    await Promise.race([
      (async () => {
        await page.goto('https://adstransparency.google.com/?region=US&preset-date=Last+30+days', {
          waitUntil: 'domcontentloaded',
          timeout: 30000
        });

        await page.waitForTimeout(1500);
        console.log('Waiting for search box...');

        const search = await page.$('[debugid="acx_177925851_179054344"]');
        
        if (!search) {
          console.error('Search box not found');
          return result;
        }

        await search.evaluate((input, keywordToo) => {
          input.value = keywordToo;
          input.dispatchEvent(new Event('input'));
        }, keyword);
        
        await page.waitForTimeout(500);
        await search.click();
        await page.waitForTimeout(750);

        try {
          await page.click('.suggestion-renderer-container');
        } catch (error) {
          console.log('Could not click suggestion container:', error.message);
          return result;
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
            }
          }
        }

        console.log('Checking SpyFu for spend data...');
        await page.goto(`https://www.spyfu.com/overview/domain?query=${keyword}`);
        await page.waitForTimeout(1000);

        try {
          const estGoogleSpend = await page.$eval('div[data-test="valueC"]', div => div.textContent || '$0.00');
          result.SPEND = estGoogleSpend.trim();
        } catch (error) {
          console.log('Could not fetch spend data:', error.message);
        }

        return result;
      })(),
      timeoutPromise
    ]);

    return result;
  } catch (error) {
    console.error('Scraping error:', error);
    throw error;
  } finally {
    if (browser) {
      await browser.close().catch(console.error);
    }
    console.log('=== SCRAPING END ===');
  }
}

app.post('/scrape', async (req, res) => {
  const requestStart = Date.now();
  console.log('=== REQUEST START ===', new Date().toISOString());
  
  try {
    const result = await scrapeGoogleAdsLibrary(req.body.keyword);
    return res.json(result);
  } catch (error) {
    console.error('Request error:', error);
    return res.status(500).json({
      error: 'Scraping failed',
      details: error.message,
      time: new Date().toISOString(),
      duration: Date.now() - requestStart
    });
  }
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

exports.scrapeAds = app;
