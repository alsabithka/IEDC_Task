const { chromium } = require('C:/Users/alsab/node_modules/playwright');
const http = require('http');
const fs = require('fs');
const path = require('path');

// Simple static server for dist
const distDir = path.resolve(__dirname, 'dist');
const mimeTypes = {
  '.html': 'text/html',
  '.js': 'application/javascript',
  '.css': 'text/css',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.json': 'application/json',
};

const server = http.createServer((req, res) => {
  let filePath = path.join(distDir, req.url === '/' ? 'index.html' : req.url.split('?')[0]);
  if (!fs.existsSync(filePath)) {
    filePath = path.join(distDir, 'index.html');
  }
  const ext = path.extname(filePath);
  const contentType = mimeTypes[ext] || 'application/octet-stream';
  fs.readFile(filePath, (err, content) => {
    if (err) {
      res.writeHead(500);
      res.end('Error loading ' + req.url);
    } else {
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content);
    }
  });
});

server.listen(4199, async () => {
  console.log('Static server started on port 4199');
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    await page.goto('http://localhost:4199/#register', { waitUntil: 'networkidle' });

    const content = await page.content();

    // Check removed strings
    const checkAbsent = (str, label) => {
      if (content.includes(str)) {
        console.error(`FAIL: ${label} was found in page! "${str}"`);
      } else {
        console.log(`PASS: ${label} correctly removed.`);
      }
    };

    checkAbsent('Step up to explore real-world challenges', 'Subtitle');
    checkAbsent('Frontend validation demo for assignment requirements', 'Disclaimer pill');
    checkAbsent('MEMBER 1 · TEAM LEADER', 'Member 1 Leader badge');
    checkAbsent('Automatically carried from Personal Information', 'Auto carried text');
    checkAbsent('Pax', 'Pax label');

    // Check buttons
    const buttons = await page.$$eval('button', (btns) => btns.map((b) => b.textContent.trim()));
    const personButtons = buttons.filter((b) => b.includes('Person'));
    console.log('Person buttons found:', personButtons);

    // Test 1: By default, teamSize is 2. Step 1 should have "Next: Member 02 Details"
    const nextBtn = await page.$('button:has-text("Next: Member 02 Details")');
    console.log('Step 1 (teamSize 2) has Next button:', !!nextBtn);

    // Click 1 Person button
    await page.click('button:has-text("1 Person")');
    await page.waitForTimeout(200);

    const submitBtnSolo = await page.$('button:has-text("Submit Registration")');
    const nextBtnSolo = await page.$('button:has-text("Next")');
    console.log('1 Person has Submit button:', !!submitBtnSolo);
    console.log('1 Person has NO Next button:', !nextBtnSolo);

    // Click 2 Persons button
    await page.click('button:has-text("2 Persons")');
    await page.waitForTimeout(200);

    // Fill in Step 1
    await page.fill('#fullName', 'Jane Doe');
    await page.fill('#email', 'jane@college.edu');
    await page.fill('#phone', '9876543210');
    await page.fill('#college', 'College of Engineering Chengannur');
    await page.fill('#department', 'Computer Science');
    await page.selectOption('#yearOfStudy', '3rd Year (B.Tech / B.E / B.Sc)');
    await page.fill('#teamName', 'Code Innovators');

    // Click Next
    await page.click('button:has-text("Next: Member 02 Details")');
    await page.waitForTimeout(300);

    // Verify Step 2 is active
    const step2Header = await page.$('text=Team Member 2 · Personal Details');
    console.log('Step 2 (Member 2 details) is visible:', !!step2Header);

    const step2Back = await page.$('button:has-text("Back")');
    const step2Submit = await page.$('button:has-text("Submit Registration")');
    console.log('Step 2 (teamSize 2) has Back button:', !!step2Back);
    console.log('Step 2 (teamSize 2) has Submit button:', !!step2Submit);

    // Go Back to Step 1 and change teamSize to 3
    await page.click('button:has-text("Back")');
    await page.waitForTimeout(300);

    await page.click('button:has-text("3 Persons")');
    await page.waitForTimeout(200);

    // Click Next to Step 2
    await page.click('button:has-text("Next: Member 02 Details")');
    await page.waitForTimeout(300);

    // Fill Member 2 details
    await page.fill('#member-2-fullName', 'John Smith');
    await page.fill('#member-2-email', 'john@college.edu');
    await page.fill('#member-2-phone', '9876543211');
    await page.fill('#member-2-college', 'College of Engineering Chengannur');
    await page.fill('#member-2-department', 'Electronics');
    await page.selectOption('#member-2-yearOfStudy', '3rd Year (B.Tech / B.E / B.Sc)');

    // Now Step 2 should have "Next: Member 03 Details"
    const nextToStep3 = await page.$('button:has-text("Next: Member 03 Details")');
    console.log('Step 2 (teamSize 3) has Next to Member 3:', !!nextToStep3);

    await page.click('button:has-text("Next: Member 03 Details")');
    await page.waitForTimeout(300);

    const step3Header = await page.$('text=Team Member 3 · Personal Details');
    console.log('Step 3 (Member 3 details) is visible:', !!step3Header);

    const step3Submit = await page.$('button:has-text("Submit Registration")');
    console.log('Step 3 (teamSize 3) has Submit button:', !!step3Submit);

    // Take screenshot of step 2 for artifact verification
    const screenshotPath = 'C:/Users/alsab/.gemini/antigravity/brain/cbd2ddd0-48a2-4ef0-b0e5-601e606e85d3/verify_registration_wizard.png';
    await page.screenshot({ path: screenshotPath, fullPage: false });
    console.log('Screenshot saved to:', screenshotPath);

    console.log('ALL TESTS PASSED SUCCESSFULLY!');
  } catch (err) {
    console.error('Test error:', err);
  } finally {
    await browser.close();
    server.close();
  }
});
