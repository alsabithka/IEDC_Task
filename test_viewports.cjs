const { chromium } = require('playwright');
const path = require('path');

const viewports = [
  { name: 'desktop_1917x852', width: 1917, height: 852 },
  { name: 'desktop_1440x900', width: 1440, height: 900 },
  { name: 'desktop_1366x768', width: 1366, height: 768 },
  { name: 'desktop_1280x720', width: 1280, height: 720 },
  { name: 'desktop_1212x531', width: 1212, height: 531 },
  { name: 'mobile_390x844', width: 390, height: 844 },
  { name: 'mobile_375x812', width: 375, height: 812 },
  { name: 'mobile_360x800', width: 360, height: 800 },
];

async function capture() {
  const browser = await chromium.launch({ headless: true });
  const outDir = 'C:\\Users\\alsab\\.gemini\\antigravity\\brain\\cbd2ddd0-48a2-4ef0-b0e5-601e606e85d3';

  for (const vp of viewports) {
    const page = await browser.newPage({
      viewport: { width: vp.width, height: vp.height },
      deviceScaleFactor: 1,
    });

    await page.goto('http://localhost:5173', { waitUntil: 'networkidle' });
    // Wait for preloader curtain lift to complete
    await page.waitForTimeout(4200);

    const screenshotPath = path.join(outDir, `audit_${vp.name}.png`);
    await page.screenshot({ path: screenshotPath, fullPage: false });

    // Check CTA visibility on desktop
    const isDesktop = vp.width >= 1024;
    const ctaSelector = isDesktop ? 'div.hidden.lg\\:block a' : 'div.lg\\:hidden a';
    const cta = await page.$(ctaSelector);
    let ctaBox = null;
    if (cta) {
      ctaBox = await cta.boundingBox();
    }

    console.log(`Viewport ${vp.name} (${vp.width}x${vp.height}): CTA box:`, ctaBox, `Visible in initial viewport: ${ctaBox ? ctaBox.y + ctaBox.height <= vp.height : false}`);

    await page.close();
  }

  await browser.close();
  console.log('Capture finished.');
}

capture().catch(err => {
  console.error(err);
  process.exit(1);
});
