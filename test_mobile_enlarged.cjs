const { chromium } = require('playwright');
const path = require('path');

const outDir = 'C:\\Users\\alsab\\.gemini\\antigravity\\brain\\cbd2ddd0-48a2-4ef0-b0e5-601e606e85d3';

const viewports = [
  { name: 'phone_enlarged_390x844', width: 390, height: 844 },
  { name: 'phone_enlarged_375x812', width: 375, height: 812 },
  { name: 'phone_enlarged_360x800', width: 360, height: 800 },
  { name: 'desktop_check_1440x900', width: 1440, height: 900 },
];

async function capture() {
  const browser = await chromium.launch({ headless: true });

  for (const vp of viewports) {
    const page = await browser.newPage({ viewport: { width: vp.width, height: vp.height } });
    await page.goto('http://localhost:5173', { waitUntil: 'networkidle' });
    await page.waitForTimeout(4200);

    const screenshotPath = path.join(outDir, `${vp.name}.png`);
    await page.screenshot({ path: screenshotPath, fullPage: false });

    const hasOverflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
    console.log(`Viewport ${vp.name}: overflow=${hasOverflow}`);

    await page.close();
  }

  await browser.close();
  console.log('Done.');
}

capture().catch(err => {
  console.error(err);
  process.exit(1);
});
