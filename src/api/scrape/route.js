import { chromium } from 'playwright-core';
import { NextResponse } from 'next/server';

export async function POST(request) {
  const { keyword } = await request.json();
  
  if (!keyword) {
    return NextResponse.json({ error: 'Keyword is required' }, { status: 400 });
  }

  const result = await scrapeGoogleAdsLibrary(keyword);
  return NextResponse.json(result);
}

async function scrapeGoogleAdsLibrary(keyword) {
  const browser = await chromium.launch({ headless: true }); 
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

    //GET SPYFU DATA
    await page.goto(`https://www.spyfu.com/overview/domain?query=${keyword}`);
    await page.waitForTimeout(2000);

    const estGoogleSpend = await page.$eval('div[data-test="valueC"]', div => div.textContent || '$0.00');
    console.log('Estimated Google Spend:', estGoogleSpend);
    result.SPEND = estGoogleSpend;

  } catch (error) {
    console.error('Error scraping Google Ads Library:', error);
  } finally {
    await browser.close();
  }

  return result;
}