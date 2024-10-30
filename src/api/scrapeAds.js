const express = require('express');
const cors = require('cors');
const { chromium } = require('playwright-core');

const app = express();
const port = 3040;

// Configure CORS
app.use(cors({
  origin: 'http://localhost:3030', // Allow only your frontend origin
  methods: ['POST', 'GET', 'OPTIONS'], // Allowed methods
  allowedHeaders: ['Content-Type'] // Allowed headers
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

    console.log('Waiting for 3 seconds...');
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
      console.error('Element not found');
    }

    await page.waitForTimeout(1500);

    await page.click('.suggestion-renderer-container');
    await page.waitForTimeout(1500);

    await page.evaluate(() => {window.scrollTo(0, document.body.scrollHeight);});

    const creativePreviews = await page.$$('creative-preview');
    
    if (creativePreviews.length > 0) {
      for (const preview of creativePreviews) {
        const imgSrc = await preview.$eval('img', img => img.src);
        result.ADS.push({ preview: imgSrc });
      }
    } else {
      console.error('No creative-preview elements found');
    }

    await page.goto(`https://www.spyfu.com/overview/domain?query=${keyword}`);
    await page.waitForTimeout(2000);

    const estGoogleSpend = await page.$eval('div[data-test="valueC"]', div => div.textContent || '$0.00');
    console.log('Estimated Google Spend:', estGoogleSpend);
    result.SPEND = estGoogleSpend.trim() || '';

  } catch (error) {
    console.error('Error scraping Google Ads Library:', error);
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

app.listen(port, () => {
  console.log(`API server running at http://localhost:${port}`);
});