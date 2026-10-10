import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

async function capture() {
  const screenshotsDir = path.resolve(__dirname, '../screenshots');
  if (!fs.existsSync(screenshotsDir)) {
    fs.mkdirSync(screenshotsDir, { recursive: true });
  }

  // First fetch student token via API
  console.log('Authenticating student session...');
  const loginRes = await fetch('http://localhost:4000/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'student@ieltsplatform.test',
      password: 'Password123!',
    }),
  });
  const loginData = await loginRes.json();
  const token = loginData.token;
  console.log('Logged in as:', loginData.user?.fullName);

  // Set goal for student so Days Before Exam and Target Band display values
  await fetch('http://localhost:4000/api/auth/profile', {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      targetBand: 7.5,
      testDate: '2026-11-20',
      testTypePreference: 'academic',
    }),
  });

  console.log('Launching browser...');
  const browser = await puppeteer.launch({
    executablePath: edgePath,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1366, height: 768, deviceScaleFactor: 2 });

  await page.goto('http://localhost:4000', { waitUntil: 'networkidle0' });

  // Store token and progress flags
  await page.evaluate((jwt) => {
    localStorage.setItem('ielts_auth_token', jwt);
    localStorage.setItem('ielts_has_explored_source', 'true');
    localStorage.setItem('ielts_has_saved_word', 'true');
    localStorage.setItem('ielts_has_reviewed_word', 'true');
  }, token);

  await page.reload({ waitUntil: 'networkidle0' });
  await new Promise((r) => setTimeout(r, 1200));

  // 1. Dashboard screenshot
  console.log('Capturing Dashboard Redesign...');
  await page.screenshot({ path: path.join(screenshotsDir, 'dashboard_redesign.png'), fullPage: false });

  // 2. Catalogue screenshot
  console.log('Navigating to Catalogue...');
  const readingNav = await page.$('nav button ::-p-text(Reading)');
  if (readingNav) {
    await readingNav.click();
    await new Promise((r) => setTimeout(r, 1200));
    console.log('Capturing Catalogue Redesign...');
    await page.screenshot({ path: path.join(screenshotsDir, 'catalogue_redesign.png'), fullPage: false });
  }

  // 3. Vocabulary screenshot
  console.log('Navigating to Vocabulary...');
  const vocabNav = await page.$('nav button ::-p-text(Vocabulary)');
  if (vocabNav) {
    await vocabNav.click();
    await new Promise((r) => setTimeout(r, 1000));
    console.log('Capturing Vocabulary Redesign...');
    await page.screenshot({ path: path.join(screenshotsDir, 'vocabulary_redesign.png'), fullPage: false });
  }

  // 4. Explore screenshot
  console.log('Navigating to Explore...');
  const exploreNav = await page.$('nav button ::-p-text(Explore)');
  if (exploreNav) {
    await exploreNav.click();
    await new Promise((r) => setTimeout(r, 1000));
    console.log('Capturing Explore Redesign...');
    await page.screenshot({ path: path.join(screenshotsDir, 'explore_redesign.png'), fullPage: false });
  }

  // 5. Chat screenshot
  console.log('Navigating to Chat...');
  const chatNav = await page.$('nav button ::-p-text(Chat)');
  if (chatNav) {
    await chatNav.click();
    await new Promise((r) => setTimeout(r, 1000));
    console.log('Capturing Chat Redesign...');
    await page.screenshot({ path: path.join(screenshotsDir, 'chat_redesign.png'), fullPage: false });
  }

  await browser.close();
  console.log('All screenshots captured successfully!');
}

capture().catch((err) => {
  console.error('Screenshot capture failed:', err);
  process.exit(1);
});
