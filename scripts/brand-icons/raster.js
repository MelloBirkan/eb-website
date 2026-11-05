// Rasterizes SVG jobs with Chromium: node raster.js jobs.json, jobs = [{ svg, size, out }]. Transparent background.
const { chromium } = require('playwright');
const fs = require('fs');
(async () => {
  const jobs = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'));
  const browser = await chromium.launch();
  const page = await browser.newPage({ deviceScaleFactor: 1 });
  for (const j of jobs) {
    await page.setViewportSize({ width: j.size, height: j.size });
    const svg = j.svg.replace(/width="\d+" height="\d+"/, `width="${j.size}" height="${j.size}"`);
    await page.setContent(`<html><body style="margin:0;background:transparent">${svg}</body></html>`);
    await page.locator('svg').screenshot({ path: j.out, omitBackground: true });
  }
  await browser.close();
})();
